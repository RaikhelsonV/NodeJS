import express from 'express';
import * as urlService from '../services/urlService.js';

const router = new express.Router();

router.get('/:code', (req, res) => {
    const code = req.params.code;
    const urlData = urlService.getUrlInfo(code);

    if (urlData) {
        urlService.addVisit(code);
        res.redirect(302, urlData.url);
    } else {
        res.status(404).send('Not Found');
    }
});

export default router;
