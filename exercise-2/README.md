# Lab exercise 2

Advanced databases lab exercise No. 2 in Node

To run:

1. Provide database connection parameters through environment variables (e.g. `.env` file in project root) with necessary variables

    - MONGODB_URI=mongodbConnectionURI
    - MONGODB_DBNAME=mongodbDBname

2. Install dependencies `npm i` or `yarn`
3. `npm start` or `yarn start` for the web server

For the crawler:
  1. Provide an API key for the BBC news article api for scraping sample data through environment variables (e.g. `.env` file in project root) via the `BBC_API_KEY` variable.
  2. Install dependencies (if you already haven't) `npm i` or `yarn`
  3. Run the crawler with `yarn crawl` or `npm run crawl`


Requirements:
  - npm v4+ or yarn
  - node 6+
