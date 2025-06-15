const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.get('/', urlController.getHome);
router.post('/shorten', urlController.createShortUrl);
router.get('/:shortUrl', urlController.redirectToOriginalUrl);
router.get('/stats/:shortUrl', urlController.getUrlStats);

module.exports = router;