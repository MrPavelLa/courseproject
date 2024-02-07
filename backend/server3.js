const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const lecturRoutes = require('./routes/lecturRoutes');

const app = express();
const PORT = process.env.PORT || 5003;

mongoose.connect('mongodb://localhost:27017/WLT', {
});

app.use(cors());
app.use(express.json());
app.use('/lectures', lecturRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
