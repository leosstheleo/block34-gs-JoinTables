const router = require('express').Router();
const { fetchReservations } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const Reservations= await fetchReservations();
    res.status(200).send(Reservations)}
    catch (error) {
    next (error)
}
})

module.exports = router;