const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const sectionController = require('../controllers/sectionController');
const studentController = require('../controllers/studentController');
const { validateSectionSchema } = require('../models/Section');



router.get('/', (req, res) => res.status(200).send("sections"));

router.get('/all/:course_id', (req, res) => sectionController.getAllSectionsByCourse(req, res));

router.get('/:section_id', (req, res) => sectionController.getSectionById(req, res));

router.get('/:section_id/students', (req, res) => sectionController.getStudentsBySectionId(req, res));

router.get('/:section_id/instructors', (req, res) => sectionController.getInstructorsBySectionId(req, res));

router.get('/:section_id/grades/:student_id', (req, res) => sectionController.calculateStudentTotalGrade(req, res));
router.get('/:section_id/grades/all', (req, res) => sectionController.calculateAllStudentsTotalGrade(req, res));

router.put('/students/add/:student_id', (req, res) => studentController.addStudentSection(req, res));

router.post('/', validator.body(validateSectionSchema()), (req, res) => {
	sectionController.createSection(req, res);
});

router.put('/', validator.body(validateSectionSchema(false)), (req, res) => {
	sectionController.updateSectionInfo(req, res);
});

router.delete('/', (req, res) => sectionController.deleteSectionById(req, res));

module.exports = router;