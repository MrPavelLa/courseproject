const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const trainingRoutes = require('./routes/trainingRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

mongoose.connect('mongodb://localhost:27017/WLT', {
});

app.use(cors());
app.use(express.json());
app.use('/trainings', trainingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});