const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Assignment } = require('../models/Assignment');
const { Section } = require('../models/Section');
const fileController = require('./fileController');

const assignmentController = {
	getAllAssignments: async (req, res) => {
		return res.status(200).send(await Assignment.find());
	},

	getAllAssignmentsBySectionId: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");
		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("The section with the given ID was not found");

		let assignments = await Assignment.find({ section: section_id });

		return res.status(200).json(assignments);
	},

	getAssignmentById: async (req, res) => {
		let assignment_id = req.params.assignment_id;

		if (!isValidObjectId(assignment_id))
			return res.status(400).send("Invalid ID");

		let assignment = await Assignment.findById(assignment_id);

		if (!assignment)
			return res.status(404).send("The assignment with the given ID was not found.");

		return res.status(200).json(assignment);
	},

	getAssignmentsBySectionId: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(assignment_id);

		if (!section)
			return res.status(404).send("The section with the given ID was not found.");

		return res.status(200).send(section.assignments);
	},

	createAssignment: async (req, res) => {
		try {
			const { name, section: section_id } = req.body;

			if (!(isValidObjectId(section_id)))
				return res.status(400).send("Invalid ID");

			let section = await Section.findById(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID was not found.");

			let assignment = await Assignment.findOne({ name });

			if (assignment)
				return res.status(404).send("An assignment with the same name already exists");

			// otherwise create assignment
			assignment = new Assignment(
				_.pick(req.body, [
					'section',
					'name', 'description', 'type',
					'maxGrade', 'gradePercentage',
					'startDate', 'startTime', 'endDate', 'endTime',
					'visibility', 'isVisible',
					'allowLateSubmissions', 'allowMultipleSubmissions'
				])
			);

			if (req?.files?.files)
				fileController.attachFiles(req, res, assignment);

			assignment = await assignment.save();

			req.body.assignment = assignment;
			req.body.type = "assignment";

			fileController.addToHierarchy(req, res);

			// return res.status(201).json(assignment);

		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	updateAssignmentInfo: async (req, res) => {
		try {
			let assignment_id = req.body.assignment_id;

			if (!isValidObjectId(assignment_id))
				return res.status(400).send("Invalid ID");

			let assignment = await Assignment.findById(assignment_id);

			if (!assignment)
				return res.status(404).send("The assignment with the given ID does not exist");

			for (let prop in req.body)
				if (prop !== "assignment_id" && prop !== "files")
					assignment[prop] = req.body[prop];


			if (req?.files?.files)
				fileController.attachFiles(req, res, assignment);

			await assignment.save();

			return res.status(201).json(assignment);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	// FIX also remove assignment from section
	deleteAssignmentById: async (req, res) => {
		try {
			let assignment_id = req.body.assignment_id;

			if (!isValidObjectId(assignment_id))
				return res.status(400).send("Invalid ID");

			let assignment = await Assignment.findByIdAndDelete(assignment_id);

			if (!assignment)
				return res.status(404).send("The assignment with the given ID does not exist");

			req.body.assignment = assignment;
			req.body.type = "assignment";
			// return res.status(200).json(assignment);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	}
}

module.exports = assignmentController;