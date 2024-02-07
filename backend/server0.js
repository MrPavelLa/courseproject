const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Verif = require('./models/verificationModel');
const verificationRoutes = require('./routes/verificationRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/WLT', {
});

const secretKey = 'TigerEyes39!';

app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await Verif.findOne({ login, password });

    if (!user) {
      return res.json({ error: 'Ошибка авторизации' });
    } else {
      const token = jwt.sign({ login: user.login, role: user.role, code: user.itemId }, secretKey, { expiresIn: '1h' });

      res.cookie('jwt', token, { httpOnly: true });

      res.json({ role: user.role, code: user.itemId, token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use('/verification', verificationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

