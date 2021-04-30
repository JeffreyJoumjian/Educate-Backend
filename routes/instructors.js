const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const instructorController = require('../controllers/instructorController');
const { validateInstructorSchema } = require('../models/Instructor');


router.get('/', (req, res) => res.status(200).send('instructors'));

router.post('/', validator.body(validateInstructorSchema(true)), (req, res) => {
	instructorController.createInstructor(req, res);
});

router.put('/', validator.body(validateInstructorSchema(false)), (req, res) => {
	instructorController.updateInstructorInfo(req, res);
});


module.exports = router;