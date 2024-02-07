const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect('mongodb://localhost:27017/WLT', {
});

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});