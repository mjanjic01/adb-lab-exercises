const { Router } = require('express');
const { Client } = require('pg');

const client = new Client()
const router = Router();

client.connect();

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
