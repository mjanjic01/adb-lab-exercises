const { Router } = require('express');
const { Client } = require('pg');

const client = new Client();
const router = Router();

client.connect();

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

    client.query(query, values)
    .then(({ rows }) => res.status(201).send(rows))
    .catch(err => res.status(400).send(err));
  }
});

/* POST movies query */
router.post('/movies/search', (req, res) => {
  const OPERATOR_MAP = {
    AND: '&',
    OR: '|'
  };

  const {
    searchTerms,
    operator
  } = req.body;

  if (!searchTerms || !operator) {
    res.sendStatus(400);
  } else {
    // searchTerms = '"Legend of Tarzan" "Lord of" Dance';

    // mistery 🙈
    const patterns = searchTerms.split('"').filter(term => term.trim().length).reduce((acc, val) => {
      const filteredTerms = val.trim().split(' ').filter(term => term.trim().length);
      const phrases = filteredTerms.length > 1 ? ['(', filteredTerms.join(` ${OPERATOR_MAP.AND} `), ')'].join('') : filteredTerms;
      return acc.concat(phrases);
    }, []).join(` ${OPERATOR_MAP[operator]} `);

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

    client.query(query, [patterns])
      .then(({ rows }) => res.status(200).send({
        rows,
        query: query.replace(/\$1/g, `'${patterns}`)
      })).catch((err) => {
        res.status(400).send(err);
        console.log(err);
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

    client.query(query, [search])
    .then(({ rows }) => res.status(200).send(rows))
    .catch(err => res.status(400).send(err));
  }
});

module.exports = router;
