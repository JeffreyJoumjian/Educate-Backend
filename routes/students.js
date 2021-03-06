const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const studentController = require('../controllers/studentController');
const { validateStudentSchema } = require('../models/Student');

router.get('/all', (req, res) => studentController.getAllStudents(req, res));

router.get('/:student_id', (req, res) => studentController.getStudentById(req, res));

router.get('/:student_id/courses', (req, res) => studentController.getStudentSections(req, res));


router.post('/', validator.body(validateStudentSchema()), (req, res) => {
	studentController.createStudent(req, res);
});


router.put('/', validator.body(validateStudentSchema(false)), (req, res) => studentController.updateStudentInfo(req, res));

router.put('/:student_id/courses/add/:section_id', (req, res) => studentController.addStudentSection(req, res));

router.delete('/', (req, res) => studentController.deleteStudentById(req, res));
router.delete('/:student_id/courses/:section_id', (req, res) => studentController.removeStudentSection(req, res));

module.exports = router;