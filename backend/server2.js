const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webinarRoutes = require('./routes/webinarRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

mongoose.connect('mongodb://localhost:27017/WLT', {
});

app.use(cors());
app.use(express.json());
app.use('/webinars', webinarRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
