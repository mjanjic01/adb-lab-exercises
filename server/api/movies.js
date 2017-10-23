const { Router } = require('express');
const moment = require('moment');

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

/* POST movies query - 🙈 mystery */
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
    const patternsFTS = [];
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
        patternsFTS.push(phraseTokens.join(` ${OPERATOR_MAP.AND} `));
        const logicalPhrase = phraseTokens.length > 1 ? ['(', phraseTokens.join(` ${OPERATOR_MAP.AND} `), ')'].join('') : phraseTokens[0];
        return acc.concat(logicalPhrase);
      }, [])
    );

    const searchAudit = regularSearchTerms
      .concat(phrases)
      .map(phrase => `'${phrase}'`)
      .join(` ${OPERATOR_MAP[operator]} `);

    const queryFTS = patterns.reduce((acc, pattern, index) =>
      acc.concat(`weighted_tsv @@ to_tsquery('english', $${index + 2})`),
    []).join(` ${operator} `);
    const query =
      `SELECT
        movieId,
        ts_headline(title, to_tsquery('english', $1)) AS titleHeadline,
        ts_headline(description, to_tsquery('english', $1)) AS descriptionHeadline,
        ts_rank(weighted_tsv, to_tsquery('english', $1)) AS rank
      FROM movie
      WHERE ${queryFTS}
      ORDER BY rank DESC;`;

    const values = [patterns.join(` ${OPERATOR_MAP[operator]} `), ...regularSearchTerms, ...patternsFTS];
    const generatedQuery = values.reduce((acc, value, index) =>
      acc.replace(new RegExp(`\\$${index + 1}`, 'g'), `'${value}'`),
    query);

    db.query(query, values)
      .then(({ rows }) => res.status(200).send({
        rows,
        query: generatedQuery
      })).then(() =>
        db.query('INSERT INTO log(time, query) VALUES(current_timestamp, $1);', [searchAudit])
      ).catch((err) => {
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

/* POST search log */
router.post('/movies/log', (req, res) => {
  const granulationMap = {
    DAY: 'day',
    HOUR: 'hour'
  };
  const {
    startTime,
    endTime,
    granulation
  } = req.body;
  let start = moment(startTime).date();
  let end = moment(endTime).date();

  if (!startTime || !endTime || !granulationMap[granulation]) {
    res.sendStatus(400);
  } else {
    let span = end - start;
    if (span === 0) {
      start = moment(startTime).hour();
      end = moment(endTime).hour();
      span = end - start;
    }
    const pivotColName = (gran, val) => {
      if (gran === 'HOUR') {
        return `${granulationMap[granulation]}${val}_${val + 1} INT`;
      }

      return `${granulationMap[granulation]}${val} INT`;
    };
    const pivotColumns = [...Array(span + 1).keys()].map(day => pivotColName(granulation, day)).join(', ');
    const query =
    `SELECT *
    FROM crosstab ('
      SELECT log.query AS query,
        EXTRACT (${granulation} FROM log.time) AS ${granulationMap[granulation]},
        COUNT (*) AS queryCnt
      FROM log
      WHERE
        log.time BETWEEN ''${startTime}''::timestamp AND ''${endTime}''::timestamp
      GROUP BY log.query, ${granulationMap[granulation]}
      ORDER BY log.query, ${granulationMap[granulation]}',
      'SELECT generate_series(${start}, ${end})')
    AS pivotTable (query TEXT, ${pivotColumns});`;
    // The above query cannot be templated via the pg package
    // also moment acts as a potential escaping lib

    db.query(query)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(400).send(err));
  }
});

module.exports = router;
