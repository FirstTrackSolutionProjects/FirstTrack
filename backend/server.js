const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Enable CORS
app.use(express.json());

app.use(cors());

app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working' });
});

// Routes
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/reset-password', require('./routes/resetPassword'));

const PORT = process.env.PORT;
try{
app.listen(PORT, () => {
  
    console.log(`Server running on port ${PORT}`);
  });
  }
  catch{
    console.error(err);
  }



