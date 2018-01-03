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
  await articles
    .mapReduce(function () {
      var value = this;
      value.commentCount = (this.comments || []).length;

      if (value.commentCount > 0) {
        emit(value, value.commentCount);
      }
    }, function (key, values) {
      const totalCount = values.reduce(function (acc, commentCount) {
        return acc + commentCount;
      }, 0);

      return {
        article: key,
        commentCount: totalCount
      };
    }, {
      out: { replace: 'hot_articles' }
    });

  const hotArticles = await db
    .getCollection('hot_articles')
    .find()
    .sort({ value: -1 })
    .toArray();

  res.render('articles', {
    articles: hotArticles.map(article => article._id)
  });
});

/**
 *  GET word frequency per author.
 */
router.get('/frequency', async (req, res) => {
  const articles = db.getCollection('articles');

  const result = await articles
    .mapReduce(function () { // MAP
      const wordPattern = /(?=\S*)([a-zA-Z0-9'-]+)/g;
      const text = [this.title || '', this.description || ''].join(' ');

      const matchedWords = text.match(wordPattern);
      const counts = matchedWords.reduce(function (stats, word) {
        stats[word] = (stats[word] || 0) + 1;
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

  res.redirect(`${req.headers.referer || ''}#${articleId}`);
});


module.exports = router;
