import express from 'express';
import Expense from '../models/Expense.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find(req.query);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero delle spese' });
  }
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
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione della spesa' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { paidByEach } = req.body;

  try {
    await Expense.findByIdAndUpdate(id, { paidByEach });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento della spesa' });
  }
});

export default router;







