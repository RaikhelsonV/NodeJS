import express from 'express';
import { add } from '../models/userStorage.js';

const router = new express.Router();

router.post('/create', express.json(), (req, res) => {
    const { name, password } = req.body;
    const newUser = { name, password };
    add(newUser);

    res.json(newUser);
});

export default router;
