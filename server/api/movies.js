const { Router } = require('express');
const { Client } = require('pg');

const client = new Client()
const router = Router();

client.connect();


/* POST movies query */
router.post('/movies/search', (req, res, next) => {
  const OPERATOR_MAP = {
    AND: '&',
    OR: '|'
  };

  const {
    searchTerms,
    operator
  } = req.body;
  console.log(searchTerms, operator);

  if (!searchTerms || !operator) {
    res.sendStatus(400);

  } else {
    // searchTerms = '"Legend of Tarzan" "Lord of" Dance';
    const patterns = searchTerms.split('"').filter(term => term.trim().length).reduce((acc, val, index) => {
      const phrases = [
        '(',
        val.trim().split(' ').filter(term => term.trim().length).join(` ${OPERATOR_MAP.AND} `),
        ')'].join('');
      return acc.concat(phrases)
    }, []).join(` ${OPERATOR_MAP[operator]} `);

    const query =
      `SELECT movieId,
        ts_headline(title, to_tsquery('english', '${patterns}')),
        ts_headline(description, to_tsquery('english', '${patterns}')),
        title,
        categories,
        summary,
        description
      FROM movie;`;

    client.query(query, (err, { rows }) => {
      res.status(200).send({
        query,
        rows
      });
    });
  }
});

/* POST movies */
router.post('/movies', (req, res, next) => {
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

    client.query(query, values, (err, { rows }) => {
      res.status(201).send(rows);
    });
  }
});


module.exports = router;
