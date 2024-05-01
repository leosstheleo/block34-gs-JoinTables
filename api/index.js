const router = require('express').Router();


router.use('/Restaurants', require('./Restaurants'));
router.use('/Customers', require('./Customers'));
router.use('/Reservations', require('./Reservations'));


module.exports = router;