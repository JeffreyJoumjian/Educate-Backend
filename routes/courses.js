const router = require('express').Router();
const courseController = require('../controllers/courseController');

router.get('/', (req, res) => {
	return res.status(200).send("courses");
});

module.exports = router;