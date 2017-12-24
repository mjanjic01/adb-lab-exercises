/**
 * Crawler used for generating articles.
 * Fetches the first 30 pages from BBC articles API (580 articles)
 *
 * For import use:
 * `mongoimport --db DB_NAME --collection COLL_NAME --type json --file articles.json --jsonArray`
*/

const https = require('https');
const fs = require('fs');
require('dotenv').config();

function writeToJSON(data) {
  fs.writeFileSync('articles.json', JSON.stringify(data), { encoding: 'utf8' });
}

function requestArticles(page) {
  const ARTICLES_ENDPOINT = `https://newsapi.org/v2/everything?sources=bbc-news&language=en&page=${page}&apiKey=${process.env.BBC_API_KEY}`;
  return new Promise((resolve, reject) => {
    https.get(ARTICLES_ENDPOINT, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        reject(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData.articles);
        } catch (e) {
          reject(e.message);
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Got error: ${e.message}`));
    });
  });
}

function requestMultiplePages(pages) {
  const requests = [];
  while (--pages) { // eslint-disable-line
    requests.push(requestArticles(pages));
  }

  return Promise.all(requests)
    .then(responses => responses
      .reduce((acc, response) => acc.concat(response), [])
      .map(article => ({
        title: article.title,
        description: article.description,
        author: article.author,
        image: article.urlToImage
      })));
}

requestMultiplePages(30)
  .then((articles) => {
    writeToJSON(articles);
  })
  .catch(() => { /* ignorable */ });

