import express from 'express';
import urlStorage from '../models/urlStorage.js';
import authMiddleware from '../authMiddleware.js';
import randomCode from '../randomCode.js';

const router = new express.Router();
router.use(authMiddleware);

router.post('/add', express.json(), (req, res) => {
    console.log('body:' + JSON.stringify(req.body));
    const code = randomCode.generateHash(5);
    urlStorage.add(code, req.body, req.user);
    res.json({ code });
});

router.get('/info/:code', (req, res) => {
    const code = req.params.code;
    const urlData = urlStorage.get(code);
    urlStorage.addVisit(code);
    res.json(urlData);
});

export default router;
