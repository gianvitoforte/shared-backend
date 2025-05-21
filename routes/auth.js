import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  res.sendStatus(201);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  }).sendStatus(200);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
});

export default router;




