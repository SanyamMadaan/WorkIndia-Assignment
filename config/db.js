const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});


async function ConnectToDatabase(){
    try{
        await client.connect();
        console.log('Connected to PostgreSQL database');
    }catch(e){
        console.log('Error while connecting to database '+e);
    } 
} 

ConnectToDatabase();

module.exports = client;
