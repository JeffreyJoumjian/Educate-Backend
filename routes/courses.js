const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const courseController = require('../controllers/courseController');
const { validateCourseSchema } = require('../models/Course');

router.get('/', (req, res) => {
	return res.status(200).send("courses");
});

router.get('/:course_id', (req, res) => courseController.getCourseById(req, res));

router.post('/', validator.body(validateCourseSchema()), (req, res) => {
	courseController.createCourse(req, res);
});

router.put('/', validator.body(validateCourseSchema(false)), (req, res) => {
	courseController.updateCourseInfo(req, res);
});

router.delete('/', (req, res) => {
	courseController.deleteCourseById(req, res);
});



module.exports = router;