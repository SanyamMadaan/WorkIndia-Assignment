const express = require('express');
const validateApiKey = require('../middlewares/apiKeyMiddleware'); 
const router = express.Router();

 const client=require('../config/db');

//add train
router.post('/trains', validateApiKey, async(req,res)=>{
    const { name, source, destination, total_seats } = req.body;
    try {
      const query = `
        INSERT INTO trains (name, source, destination, total_seats, available_seats)
        VALUES ($1, $2, $3, $4, $4)
        RETURNING id, name, source, destination, total_seats, available_seats
      `;
      const values = [name, source, destination, total_seats];
      const result = await client.query(query, values);
  
      res.status(201).json({ message: 'Train added successfully', train: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Error adding train'+err });
    }
}); 

//edit train
router.put('/trains/:id', validateApiKey, async (req,res)=>{
    const trainId = req.params.id;
  const { name, source, destination, total_seats } = req.body;

  try {
    const query = `
      UPDATE trains
      SET name = COALESCE($1, name),
          source = COALESCE($2, source),
          destination = COALESCE($3, destination),
          total_seats = COALESCE($4, total_seats),
          available_seats = COALESCE($4, available_seats)  -- Update available_seats if total_seats changes
      WHERE id = $5
      RETURNING id, name, source, destination, total_seats, available_seats
    `;
    const values = [name, source, destination, total_seats, trainId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.status(200).json({ message: 'Train updated successfully', train: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error updating train' });
  }
});

//delete train
router.delete('/trains/:id', validateApiKey, async(req,res)=>{
    const trainId = req.params.id;

  try {
    const query = `DELETE FROM trains WHERE id = $1 RETURNING id`;
    const result = await client.query(query, [trainId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.status(200).json({ message: 'Train deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting train' });
  }
});

//fetch all trains
router.get('/trains', async(req,res)=>{
    try {
        const query = `SELECT id, name, source, destination, total_seats, available_seats FROM trains`;
        const result = await client.query(query);
    
        res.status(200).json({ trains: result.rows });
      } catch (err) {
        res.status(500).json({ error: 'Error fetching trains'+err });
      }
});

module.exports = router;
