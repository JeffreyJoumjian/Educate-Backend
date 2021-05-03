const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Section } = require('../models/Section');
const { Course } = require('../models/Course');

const assignmentController = {
	getAllSectionsByCourse: async (req, res) => {
		let course_id = req.params.course_id;

		if (!isValidObjectId(course_id))
			return res.status(400).send("Invalid ID");

		let course = await Course.findById(course_id);

		if (!course)
			return res.status(404).send("The course with the given ID was not found.");

		let sections = await Section.find({ course: course_id });

		// if no sections found
		if (sections.length == 0)
			return res.status(404).send("The given course does not have any sections available");

		return res.status(200).json({ course, sections });
	},

	getSectionById: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id).populate('course');

		if (!section)
			return res.status(404).send("The section with the given ID does not exist");

		return res.status(200).json(section);
	},

	getStudentsBySectionId: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id).populate('course');

		if (!section)
			return res.status(404).send("The section with the given ID does not exist");

		return res.status(200).json(section.students);
	},
	getInstructorsBySectionId: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id).populate('course');

		if (!section)
			return res.status(404).send("The section with the given ID does not exist");

		return res.status(200).json(section.instructors);
	},

	createSection: async (req, res) => {
		try {
			let course_id = req.body.course_id;

			if (!isValidObjectId(course_id))
				return res.status(400).send("Invalid ID");

			let course = await Course.findById(course_id);

			if (!course)
				return res.status(404).send("The course with the given ID was not found");

			// check if section already exists
			let section = await Section.findOne({ CRN: req.body.CRN });

			if (section)
				return res.status(400).send("Section with that CRN already exists");

			section = new Section(
				_.pick(req.body, [
					'course_id', 'CRN',
					'capacity',
					'semester',
					'startDate', 'endDate', 'schedule',
					'instructors', 'students',
					'assignments'
				])
			);

			await section.save();

			return res.status(201).json({ course, section });
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	updateSectionInfo: async (req, res) => {
		try {
			let section_id = req.body.section_id;

			if (!isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let section = await Section.findById(section_id).populate('course');

			if (!section)
				return res.status(404).send("The section with the given ID does not exist");

			for (let prop in req.body)
				section[prop] = req.body[prop];

			await section.save();

			return res.status(201).json(section);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	deleteSectionById: async (req, res) => {
		try {
			let section_id = req.body.section_id;

			if (!isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let section = await Section.findByIdAndDelete(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID does not exist");

			// await section.delete();

			return res.status(200).json(section);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	}
}

module.exports = assignmentController;