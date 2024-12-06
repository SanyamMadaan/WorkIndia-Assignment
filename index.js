const express=require('express');
const cors=require('cors');
require('dotenv').config();
// require('./dbsetup');

const PORT=process.env.PORT || 3000
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');


const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/admin',adminRoutes);
app.use('/api',userRoutes);

app.listen(PORT,()=>{
    console.log(`App is running at http://localhost:${PORT}`);
})