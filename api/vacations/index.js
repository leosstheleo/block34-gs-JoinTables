const router = require('express').Router();
const { fetchVacations } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const vacations= await fetchVacations();
    res.status(200).send(vacations)}
    catch (error) {
    next (error)
}
})

module.exports = router;