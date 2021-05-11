const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Student } = require('../models/Student');
const { Instructor } = require('../models/Instructor');
const { Submission } = require('../models/Submission');
const { Assignment } = require('../models/Assignment');

const submissionController = {
	getSubmissionById: async (req, res) => {
		let submission_id = req.params.submission_id;

		if (!isValidObjectId(submission_id))
			return res.status(400).send("Invalid ID");

		let submission = await Submission.findById(submission_id);

		if (!submission)
			return res.status(404).send("The submission with the given ID was not found");

		return res.status(200).json(submission);
	},
	getSubmissionsByAssignmentId: (req, res) => {
		let assignment_id = req.params.assignment_id;

		if (!isValidObjectId(assignment_id))
			return res.status(400).send("Invalid ID");

		let assignment = await Assignment.findById(assignment_id);

		if (!assignment)
			return res.status(404).send("The assigmnent with the given ID was not found");

		let submissions = await Submission
			.find({ assignment: assignment_id })
			.populate('assignment')
			.populate('student');

		return res.status(200).json(submissions);
	},
	getStudentSubmissionByAssignmentId: (req, res) => {

	},

	createSubmission: async (req, res) => {

	},
	updateSubmissionInfo: async (req, res) => {

	}
};

module.exports = submissionController;