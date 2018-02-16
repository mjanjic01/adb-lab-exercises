const path = require('path');

/**
 * Module dependencies.
 */
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const sassMiddleware = require('node-sass-middleware');
const errorHandler = require('errorhandler');
const helmet = require('helmet');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

/**
 * Controller (Route handlers)
 */
const articles = require('./controllers/articles');
// const controllerName = require('./controllers/controllerName');

/**
 * Connect to database.
 */
require('./db').connect();

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sassMiddleware({
  src: path.join(__dirname, 'assets', 'styles'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Primary app routes.
 */
app.use('/articles', articles);
// app.use('/route', controllerName);


app.get('*', (req, res) => {
  res.redirect('/articles');
});

/**
 * Error Handler for other errors.
 */
app.use(errorHandler());


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(`${chalk.green('✓')} App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`); // eslint-disable-line no-console
  console.log('  Press CTRL-C to stop\n'); // eslint-disable-line no-console
});

module.exports = app;
