const { Router } = require('express');
const db = require('../db');

const router = Router();

/* POST movies */
router.post('/movies', (req, res) => {
  const {
    title,
    categories,
    summary,
    description
  } = req.body;

  if (!title || !categories || !summary || !description) {
    res.sendStatus(400);
  } else {
    const query = 'INSERT INTO movie(title, categories, summary, description) VALUES($1, $2, $3, $4);';
    const values = [
      title,
      categories,
      summary,
      description
    ];

    db.query(query, values)
      .then(({ rows }) => res.status(201).send(rows));
  }
});

/* POST movies query */
router.post('/movies/search', (req, res) => {
  const OPERATOR_MAP = {
    AND: '&',
    OR: '|'
  };

  const searchTerms = req.body.searchTerms.trim();
  const operator = req.body.operator;

  if (!searchTerms || !operator) {
    res.sendStatus(400);
  } else {
    // searchTerms = '"Legend of Tarzan" "Lord of" Dance';


    /* eslint-disable no-useless-escape */
    const phrases = (searchTerms
      .match(/\"(.+?)\"/g) || [])
      .map(term => term.replace(/\"/g, '').trim());
    const regularSearchTerms = searchTerms
      .replace(/\"(.*?)\"/g, ' ')
      .split(' ')
      .map(term => term.trim())
      .filter(term => term.length);
    /* eslint-enable no-useless-escape */

    const patterns = regularSearchTerms.concat(
      phrases.reduce((acc, phrase) => {
        const phraseTokens = phrase
          .split(' ')
          .map(token => token.trim())
          .filter(token => token.length);
        const logicalPhrase = phraseTokens.length > 1 ? ['(', phraseTokens.join(` ${OPERATOR_MAP.AND} `), ')'].join('') : phraseTokens[0];
        return acc.concat(logicalPhrase);
      }, [])
    ).join(` ${OPERATOR_MAP[operator]} `);

    const searchAudit = regularSearchTerms
      .concat(phrases)
      .map(phrase => `'${phrase}'`)
      .join(` ${OPERATOR_MAP[operator]} `);

    const query =
      `SELECT
        movieId,
        title,
        description,
        ts_headline(title, to_tsquery('english', $1)) AS titleHeadline,
        ts_headline(description, to_tsquery('english', $1)) AS descriptionHeadline,
        ts_rank(to_tsvector(description), to_tsquery('english', $1)) AS rank
      FROM movie
      ORDER BY rank DESC;`;

    db.query(query, [patterns])
      .then(({ rows }) => res.status(200).send({
        rows,
        query: query.replace(/\$1/g, `'${patterns}`)
      })).then(() => {
        console.log(searchAudit);
      }).catch((err) => {
        res.status(400).send(err);
      });
  }
});


/* GET movie suggestions */
router.get('/movies/suggestions/:search', (req, res) => {
  const search = req.params.search.trim();

  if (!search) {
    res.status(200).send(search);
  } else {
    const query = 'SELECT title FROM movie WHERE similarity(movie.title, $1) > 0.2 LIMIT 5;';

    db.query(query, [search])
      .then(({ rows }) => res.status(200).send(rows))
      .catch(err => res.status(400).send(err));
  }
});

module.exports = router;
