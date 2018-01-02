/* global emit */
/* eslint-disable no-underscore-dangle, no-var, prefer-arrow-callback,
                  func-names, prefer-destructuring, no-param-reassign, object-shorthand */

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

  const result = await articles
    .mapReduce(function () { // MAP
      const wordPattern = /(?=\S*)([a-zA-Z0-9'-]+)/g;
      const text = [this.title || '', this.description || ''].join(' ');

      const matchedWords = text.match(wordPattern);
      const counts = matchedWords.reduce(function (stats, word) {
        stats[word] = stats[word] ? stats[word] + 1 : 1;
        return stats;
      }, {});

      emit(this.author, counts);
    }, function (key, values) { // REDUCE
      return values.reduce(function (acc, counts) {
        Object.keys(counts).forEach(function (word) {
          acc[word] = (acc[word] || 0) + counts[word];
        });
        return acc;
      }, {});
    }, {
      finalize: function (key, reducedValue) { // FINALIZE
        const ordered = Object.keys(reducedValue).reduce(function (acc, word) {
          acc.push([word, reducedValue[word]]);
          return acc;
        }, []).sort(function (a, b) {
          return b[1] - a[1];
        }).slice(0, 10);

        return ordered.reduce(function (acc, count) {
          acc[count[0]] = count[1];
          return acc;
        }, {});
      },
      out: { inline: 1 },
    });
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
