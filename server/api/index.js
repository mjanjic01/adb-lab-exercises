const Router = require('express').Router;

const users = require('./users');
const movies = require('./movies');

const router = Router();

// Add USERS Routes
router.use(users);
router.use(movies);

module.exports = router;
