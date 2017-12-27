/* global emit */
/* eslint-disable no-underscore-dangle, no-var, prefer-arrow-callback,
                  func-names, prefer-destructuring, no-param-reassign */

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

/**
 *  GET most commented articles page.
 */
router.get('/hot', async (req, res) => {
  const articles = db.getCollection('articles');
  res.render('articles', {
    articles: (await articles
      .mapReduce(function () {
        emit(this._id, this);
      }, function (key, values) {
        return values; // no-multiple
      }, {
        out: { inline: 1 },
        sort: { numberOfComments: 1 }
      })
    ).map(row => row.value)
  });
});

/**
 *  GET most commented articles page.
 */
router.get('/frequency', async (req, res) => {
  const articles = db.getCollection('articles');

  // 🙈
  const result = await articles
    .mapReduce(function () {
      emit(this.author, {
        title: this.title,
        description: this.description
      });
    }, function (key, values) {
      if (values.title) {
        return 0;
      }
      const pattern = /(?=\S*)([a-zA-Z0-9'-]+)/g;

      const allWords = values.reduce(function (acc, val) {
        return [acc, val.title, val.description].join(' ');
      }, '');

      const matchedWords = allWords.match(pattern);
      const counts = matchedWords.reduce(function (stats, word) {
        stats[word] = stats[word] ? stats[word] + 1 : 1;
        return stats;
      }, {});

      const ordered = Object.keys(counts).reduce(function (acc, word) {
        acc.push([word, counts[word]]);
        return acc;
      }, []).sort(function (a, b) {
        return b[1] - a[1];
      }).slice(0, 10);

      const reduced = ordered.reduce(function (acc, count) {
        acc[count[0]] = count[1];
        return acc;
      }, {});

      return reduced;
    }, { out: { inline: 1 } });
  res.render('articles/frequency', {
    frequencies: result
  });
});

/**
 * POST comment in article
 */
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
