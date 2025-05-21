import express from 'express';
import House from '../models/House.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { name, email } = req.body;
        const house = new House({ name, members: [email] });
        await house.save();
        res.sendStatus(201);
    } catch {
        res.status(400).json({ error: 'Errore nella creazione del gruppo' });
    }
});

router.post('/join', async (req, res) => {
    try {
        const { name, email } = req.body;
        const house = await House.findOne({ name });
        if (!house) return res.status(404).json({ error: 'Gruppo non trovato' });

        if (!house.members.includes(email)) {
            house.members.push(email);
            await house.save();
        }

        res.sendStatus(200);
    } catch {
        res.status(400).json({ error: 'Errore nell\'unione al gruppo' });
    }
});

router.get('/mygroups', async (req, res) => {
    const userEmail = req.query.email;
    if (!userEmail) return res.status(400).json({ error: 'Email mancante' });

    const userGroups = await House.find({ members: userEmail });
    const groupNames = userGroups.map(g => g.name);
    res.json(groupNames);
});

router.get('/members', async (req, res) => {
    const groupName = req.query.name;
    if (!groupName) return res.status(400).json({ error: 'Nome gruppo mancante' });

    const house = await House.findOne({ name: groupName });
    if (!house) return res.status(404).json({ error: 'Gruppo non trovato' });

    res.json(house.members);
});

router.post('/leave', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: 'Dati mancanti' });

        const house = await House.findOne({ name });
        if (!house) return res.status(404).json({ error: 'Gruppo non trovato' });

        house.members = house.members.filter(member => member !== email);
        await house.save();

        if (house.members.length === 0) {
            await House.deleteOne({ name });
        }

        res.status(200).json({ message: 'Abbandono del gruppo riuscito' });
    } catch {
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

export default router;



