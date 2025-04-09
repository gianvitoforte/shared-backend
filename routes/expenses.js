import express from 'express';
import Expense from '../models/Expense.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await Expense.find(req.query);
  res.json(expenses);
});

router.post('/', verifyToken, async (req, res) => {
  const { paidBy, participants, ...rest } = req.body;

  const data = {
    ...rest,
    paidBy,
    participants,
    paidByEach: [paidBy],
    createdBy: req.user.email
  };

  try {
    const expense = new Expense(data);
    await expense.save();
    res.sendStatus(201);
  } catch {
    res.status(500).json({ error: 'Errore nella creazione della spesa' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { paidByEach } = req.body;
  await Expense.findByIdAndUpdate(id, { paidByEach });
  res.sendStatus(200);
});

export default router;






