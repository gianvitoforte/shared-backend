import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import houseRoutes from './routes/house.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://shared-frontend.vercel.app',
        'https://shared-frontend-gianvito-fortes-projects.vercel.app',
        'https://shared-frontend-git-main-gianvito-fortes-projects.vercel.app',
        'shared-frontend-hgodlncng-gianvito-fortes-projects.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/house', houseRoutes);

mongoose.connect("mongodb+srv://gianvito_forte:Stefania1979%3F@shared.4lttqqa.mongodb.net/shared?retryWrites=true&w=majority&appName=shared", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server avviato sulla porta ${PORT}`);
        });
    })
    .catch((err) => console.error('Errore connessione MongoDB:', err));


