const Router = require('express').Router;

const movies = require('./movies');

const router = Router();

// Add USERS Routes
router.use(movies);

module.exports = router;
