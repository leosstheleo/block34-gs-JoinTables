const router = require('express').Router();


router.use('/places', require('./places'));
router.use('/users', require('./users'));
router.use('/vacations', require('./vacations'));


module.exports = router;