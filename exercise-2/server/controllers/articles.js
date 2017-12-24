const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();
const db = require('../db');

/**
 *  GET articles page.
 */
router.get('/', async (req, res) => {
  const articles = db.getCollection('articles');
  res.render('articles', {
    articles: await articles.find().sort({ publishedAt: -1 }).limit(10).toArray()
  });
});


router.post('/:articleId/comments', async (req, res) => {
  const { articleId } = req.params;
  const newComment = {
    text: req.body.text,
    time: new Date()
  };

  const articles = db.getCollection('articles');
  await articles.findOneAndUpdate({
    _id: ObjectId(articleId)
  }, {
    $push: { comments: newComment }
  });

  res.redirect(`/articles#${articleId}`);
});


module.exports = router;
