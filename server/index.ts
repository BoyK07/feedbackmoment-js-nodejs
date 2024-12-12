import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 3000;

app.use(express.json);
app.use(cors())

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;