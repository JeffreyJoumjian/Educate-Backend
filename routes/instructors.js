const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const instructorController = require('../controllers/instructorController');
const { validateInstructorSchema } = require('../models/Instructor');


router.get('/', (req, res) => res.status(200).send('instructors'));

router.get('/all', (req, res) => instructorController.getAllInstructors(req, res));

router.get('/:instructor_id', (req, res) => {
	instructorController.getInstructorById(req, res);
});

router.get('/:instructor_id/sections', (req, res) => instructorController.getTeachingSections(req, res));

router.post('/', validator.body(validateInstructorSchema(true)), (req, res) => {
	instructorController.createInstructor(req, res);
});


router.put('/', validator.body(validateInstructorSchema(false)), (req, res) => {
	instructorController.updateInstructorInfo(req, res);
});

router.put('/:instructor_id/sections/:section_id', (req, res) => instructorController.getTeachingSections(req, res));

router.delete('/', (req, res) => {
	instructorController.deleteInstructorById(req, res);
});

module.exports = router;