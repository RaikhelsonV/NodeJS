import express from 'express';
import * as userService from '../services/userService.js';

const router = new express.Router();

router.post('/create', express.json(), (req, res) => {
    const newUser = userService.createUser(req.body);
    res.json(newUser);
});

export default router;
