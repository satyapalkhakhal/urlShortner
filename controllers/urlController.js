const Url = require('../models/Url');
const generateShortUrl = require('../utils/generateShortUrl');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

exports.getHome = (req, res) => {
  res.render('index', {
      shortUrl: null // or false or undefined
    });
};

exports.createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.render('index', {
        shortUrl: `${baseUrl}/${url.shortUrl}`,
      });
    }

    // Create new short URL
    const shortUrl = generateShortUrl();
    url = new Url({
      originalUrl,
      shortUrl,
    });

    await url.save();
    res.render('index', {
      shortUrl: `${baseUrl}/${shortUrl}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate(
      { shortUrl: req.params.shortUrl },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.getUrlStats = async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    
    if (!url) {
      return res.status(404).send('URL not found');
    }

    res.render('stats', {
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/${url.shortUrl}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};