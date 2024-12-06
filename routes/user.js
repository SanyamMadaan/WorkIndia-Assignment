const express = require('express');
const authenticateUser = require('../middlewares/authMiddleware');
const router = express.Router();

// const client=require('../config/db');

// Auth routes
router.post('/register', async(req,res)=>{
    const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, password, role) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, role
    `;
    const values = [username, hashedPassword, role];
    const result = await client.query(query, values);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', async(req,res)=>{
    const { username, password } = req.body;

    try {
      const query = `SELECT * FROM users WHERE username = $1`;
      const result = await client.query(query, [username]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(403).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
});

// User operations
router.get('/trains', authenticateUser, async (req, res) => {
      const { source, destination } = req.query;  // Assuming these parameters are passed as query parameters
    
      try {
        const query = `
          SELECT id, name, source, destination, total_seats, available_seats
          FROM trains
          WHERE source = $1 AND destination = $2
        `;
        const result = await client.query(query, [source, destination]);
    
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'No trains found between the given stations' });
        }
    
        res.status(200).json({ trains: result.rows });
      } catch (err) {
        res.status(500).json({ error: 'Error fetching seat availability' });
      }
    }
    );


router.post('/book', authenticateUser, async(req,res)=>{
    const { train_id, seat_count } = req.body;
    const user_id = req.user.id;
  
    try {
      await client.query('BEGIN');
  
      const lockQuery = `
        SELECT available_seats FROM trains
        WHERE id = $1 FOR UPDATE
      `;
      const lockResult = await client.query(lockQuery, [train_id]);
  
      if (lockResult.rows[0].available_seats < seat_count) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient seats' });
      }
  
      const updateQuery = `
        UPDATE trains
        SET available_seats = available_seats - $1
        WHERE id = $2
      `;
      await client.query(updateQuery, [seat_count, train_id]);
  
      const insertQuery = `
        INSERT INTO bookings (user_id, train_id, seat_count)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const bookingResult = await client.query(insertQuery, [user_id, train_id, seat_count]);
  
      await client.query('COMMIT');
      res.status(201).json({ message: 'Booking successful', booking: bookingResult.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Booking failed' });
    }
});
router.get('/bookings/:id', authenticateUser,  async (req, res) => {
      const bookingId = req.params.bookingId;
    
      try {
        const query = `
          SELECT b.id, b.train_id, b.user_id, b.seats_booked, t.name AS train_name, t.source, t.destination
          FROM bookings b
          JOIN trains t ON b.train_id = t.id
          WHERE b.id = $1
        `;
        const result = await client.query(query, [bookingId]);
    
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Booking not found' });
        }
    
        res.status(200).json({ booking: result.rows[0] });
      } catch (err) {
        res.status(500).json({ error: 'Error fetching booking details' });
      }
    }
    );

module.exports = router;
