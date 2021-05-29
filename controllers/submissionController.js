const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Student } = require('../models/Student');
const { Submission } = require('../models/Submission');
const { Assignment } = require('../models/Assignment');
const { Section } = require('../models/Section');
const fileController = require('./fileController');

const submissionController = {
	getSubmissionById: async (req, res) => {
		let submission_id = req.params.submission_id;

		if (!isValidObjectId(submission_id))
			return res.status(400).send("Invalid ID");

		let submission = await Submission
			.findById(submission_id)
			.populate('assignment')
			.populate('student');

		if (!submission)
			return res.status(404).send("The submission with the given ID was not found");

		return res.status(200).json(submission);
	},
	getSubmissionsByAssignmentId: async (req, res) => {
		let assignment_id = req.params.assignment_id;

		if (!isValidObjectId(assignment_id))
			return res.status(400).send("Invalid ID");

		let assignment = await Assignment.findById(assignment_id);

		if (!assignment)
			return res.status(404).send("The assignment with the given ID was not found");

		let submissions = await Submission
			.find({ assignment: assignment_id })
			.populate('assignment')
			.populate('student');

		return res.status(200).json(submissions);
	},
	getStudentSubmissionByAssignmentId: async (req, res) => {
		let assignment_id = req.params.assignment_id;
		let student_id = req.params.student_id;

		if (!isValidObjectId(assignment_id) || !isValidObjectId(student_id))
			return res.status(400).send("Invalid ID");

		let assignment = await Assignment.findById(assignment_id);

		if (!assignment)
			return res.status(404).send("The assignment with the given ID was not found");

		let submission = await Submission
			.findOne({ assignment: assignment_id, student: student_id })
			.populate('assignment')
			.populate('student');

		if (!submission)
			return res.status(404).send("The student has not submitted any submissions for this assignment.");

		return res.status(200).json(assignment);
	},

	getAllStudentSubmissionsForSection: async (req, res) => {
		const { section_id, student_id } = req.params;

		if (!isValidObjectId(section_id) || !isValidObjectId(student_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);
		let student = await Student.findById(student_id);

		if (!section)
			return res.status(404).send("The section with the given ID was not found");

		if (!student)
			return res.status(404).send("The section with the given ID was not found");

		let assignments = await Assignment.find({ section: section_id });
		let submissions = [];

		for (let i = 0; i < assignments.length; i++) {
			let assignment = assignments[i];

			let submission = await Submission.findOne({ assignment: assignment._id, student: student_id })
				.populate('assignment').populate('student');

			if (submission)
				submissions.push(submission);

		}

		return res.status(200).json(submissions);

	},

	// ADD file checking
	// FIX check if student is in section before submitting
	submitAssignment: async (req, res) => {
		try {
			let assignment_id = req.body.assignment_id;
			let student_id = req.body.student_id;

			if (!isValidObjectId(assignment_id) || !isValidObjectId(student_id))
				return res.status(400).send("Invalid ID");

			let assignment = await Assignment.findById(assignment_id);

			if (!assignment)
				return res.status(404).send("The assignment with the given ID was not found");

			let student = await Student.findById(student_id);

			if (!student)
				return res.status(404).send("The student with the given ID was not found");

			// check if student has already submitted
			let submission = await Submission.findOne({ student: student_id, assignment: assignment_id });

			// FIX check for late submission
			assignment.setIsActive();
			assignment = await assignment.save();

			const { isActive, allowLateSubmissions, allowMultipleSubmissions } = assignment;

			if (isActive || allowLateSubmissions) {
				// if student has already submitted => if multiple submissions, update submission else prevent
				if (!submission) {
					const { grade, isGraded, textSubmission, comments, date } = req.body;
					submission = new Submission({
						assignment: assignment_id,
						student: student_id,
						grade, isGraded, textSubmission, comments, date
					});

					if (req?.files?.files)
						fileController.attachFiles(req, res, submission);

					return res.status(201).json(await submission.save());
				}
				else if (submission && allowMultipleSubmissions) {

					for (let prop in req.body)
						if (prop !== "files")
							submission[prop] = req.body[prop];

					if (req?.files?.files)
						fileController.attachFiles(req, res, submission, true);

					return res.status(201).json(await submission.save());
				}
				else {
					return res.status(400).send("Assigment does not allow multiple submissions");
				}
			}
			return res.status(400).send("Assigment does not allow late submissions or is not active");
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	gradeSubmission: async (req, res) => {
		try {
			let submission_id = req.body.submission_id;

			if (!isValidObjectId(submission_id))
				return res.status(400).send("Invalid ID");

			let submission = await Submission.findById(submission_id);

			if (!submission)
				return res.status(404).send("The submission with the given ID was not found");

			submission = { ..._.pick(['grade', 'comments']) };
			submission.isGraded = true;

			return res.status(201).json(await submission.save());
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	}
};

module.exports = submissionController;