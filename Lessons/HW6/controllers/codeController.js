import express from 'express';
import urlStorage from '../models/urlStorage.js';

const router = new express.Router();

router.get('/:code', (req, res) => {
    const code = req.params.code;
    const urlData = urlStorage.get(code);

    if (urlData) {
        urlStorage.addVisit(code);
        res.redirect(302, urlData.url);
    } else {
        res.status(404).send('Not Found');
    }
});

export default router;
