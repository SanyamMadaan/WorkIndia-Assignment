const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});


 client.connect()
.then((res)=>console.log('Connected to PostgreSQL database'))
.catch((err)=>console.log('Error while connecting to database'))

module.exports = client;
