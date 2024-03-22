import express from 'express';
import * as urlService from '../services/urlService.js';
import authMiddleware from '../authMiddleware.js';

const router = new express.Router();
router.use(authMiddleware);

router.post('/add', express.json(), (req, res) => {
    console.log('body:' + JSON.stringify(req.body));
    const code = urlService.addUrl(req.body, req.user);
    res.json({ code });
});

router.get('/info/:code', (req, res) => {
    const code = req.params.code;
    const urlData = urlService.getUrlInfo(code);
    res.json(urlData);
});

export default router;
