import express from 'express';
import House from '../models/House.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { name, email } = req.body;
        const house = new House({ name, members: [email] });
        await house.save();
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({ error: 'Errore nella creazione del gruppo', details: error.message });
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
    } catch (error) {
        res.status(500).json({ error: 'Errore nell\'unione al gruppo', details: error.message });
    }
});

router.get('/mygroups', async (req, res) => {
    const userEmail = req.query.email;
    if (!userEmail) return res.status(400).json({ error: 'Email mancante' });

    try {
        const userGroups = await House.find({ members: userEmail });
        const groupNames = userGroups.map(g => g.name);
        res.json(groupNames);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei gruppi', details: error.message });
    }
});

router.get('/members', async (req, res) => {
    const groupName = req.query.name;
    if (!groupName) return res.status(400).json({ error: 'Nome gruppo mancante' });

    try {
        const house = await House.findOne({ name: groupName });
        if (!house) return res.status(404).json({ error: 'Gruppo non trovato' });

        res.json(house.members);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei membri', details: error.message });
    }
});

export default router;



