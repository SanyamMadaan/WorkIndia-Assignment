const express=require('express');
require('dotenv').config();
// require('./dbsetup');

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