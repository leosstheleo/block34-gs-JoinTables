const router = require('express').Router();
const { fetchCustomers } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const uCustomers = await fetchCustomers();
    res.status(200).send(Customers)}
    catch (error) {
    next (error)
}
})

module.exports = router;