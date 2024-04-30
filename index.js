// index.js
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({ message: 'Logged in' });
});

app.get('/users', async (req, res) => {
  const users = await User.findAll({ attributes: ['username'] });
  res.json(users);
});

app.get('/profile', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ where: { username: username ?? null },
      attributes: { exclude: ['password']}
    });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});