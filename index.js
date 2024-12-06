const express=require('express');
const client=require('./config/db');

require('./dbsetup');
require('dotenv').config();

const PORT=process.env.PORT || 3000
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');


const app=express();

app.use(express.json());

app.use('/api/admin',adminRoutes);
app.use('/api',userRoutes);

app.listen(PORT,()=>{
    console.log(`App is running at http://localhost:${PORT}`);
})