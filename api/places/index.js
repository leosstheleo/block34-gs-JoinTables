const router = require('express').Router();
const { fetchPlaces } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const places = await fetchPlaces();
    res.status(200).send(places)}
    catch (error) {
    next (error)
}
})

module.exports = router;