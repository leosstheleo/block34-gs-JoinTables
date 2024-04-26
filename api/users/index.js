const router = require('express').Router();
const { fetchUsers } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const users = await fetchUsers();
    res.status(200).send(users)}
    catch (error) {
    next (error)
}
})

module.exports = router;