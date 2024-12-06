const client=require('./config/db');
const createTables = async () => {
  try {
    // Creating Users Table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    await client.query(createUsersTableQuery);
    console.log('Users table created or already exists.');

    // You can similarly add queries for 'train' and 'booking' tables if needed
    // For example:
    const createTrainsTableQuery = `
      CREATE TABLE IF NOT EXISTS trains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL,
        available_seats INT NOT NULL
      );
    `;
    await client.query(createTrainsTableQuery);
    console.log('Trains table created or already exists.');

    // Repeat for other tables like bookings
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    await client.end();  // Close the database connection
  }
};

createTables();
