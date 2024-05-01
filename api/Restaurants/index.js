const router = require('express').Router();
const { fetchRestaurants } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const Restaurants = await fetchRestaurants();
    res.status(200).send(Restaurants)}
    catch (error) {
    next (error)
}
})

module.exports = router;