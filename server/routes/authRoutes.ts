import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { JWT_SECRET, usersDB } from '../config/constants';

const router = express.Router();

const checkUserFile = () => {
    if (!fs.existsSync(usersDB)) {
        fs.writeFileSync(usersDB, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(usersDB, 'utf-8'));
}

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    let users = checkUserFile();
    
    const user = users.find((user: any) => user.username === username);
    if (user) return res.status(400).json({ message: 'User already exists' });  

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ id: crypto.randomUUID, username: username, password: hashedPassword });
    
    fs.writeFileSync(usersDB, JSON.stringify(users));

    return res.status(201).json({ message: 'User created' });
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    let users = checkUserFile();

    const user = users.find((user: any) => user.username === username);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    return res.status(200).json({ token });
});

export default router;