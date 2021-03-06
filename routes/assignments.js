const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const assignmentController = require('../controllers/assignmentController');
const { validateAssignmentSchema } = require('../models/Assignment');



router.get('/', (req, res) => res.status(200).send("assignments"));

router.get('/all', (req, res) => assignmentController.getAllAssignments(req, res));

router.get('/:section_id/all', (req, res) => assignmentController.getAllAssignmentsBySectionId(req, res));

router.get('/:assignment_id', (req, res) => assignmentController.getAssignmentById(req, res));

router.post('/', validator.body(validateAssignmentSchema()), (req, res) => {
	assignmentController.createAssignment(req, res);
});

router.put('/', validator.body(validateAssignmentSchema(false)), (req, res) => {
	assignmentController.updateAssignmentInfo(req, res);
});

router.delete('/', (req, res) => {
	assignmentController.deleteAssignmentById(req, res);
});

module.exports = router;