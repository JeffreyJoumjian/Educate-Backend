const submissionController = require('../controllers/submissionController');
const validator = require('express-joi-validation').createValidator({});
const { validateSubmissionSchema } = require('../models/Submission');

const router = require('express').Router();

router.get('/', (req, res) => res.status(200).send("Submissions"));

router.get('/:submission_id', (req, res) => submissionController.getSubmissionById(req, res));
router.get('/:assignment_id', (req, res) => submissionController.getSubmissionsByAssignmentId(req, res));

router.get('/:student_id/assignment/:assignment_id', (req, res) => {
	submissionController.getStudentSubmissionByAssignmentId(req, res)
});

router.post('/submit', validator.body(validateSubmissionSchema()), (req, res) => submissionController.submitAssignment(req, res));

router.put('/grade', validator.body(validateSubmissionSchema(false)), (req, res) => submissionController.gradeSubmission(req, res));

module.exports = router;