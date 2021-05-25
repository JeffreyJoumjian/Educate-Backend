const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Student } = require('../models/Student');
const { Section } = require('../models/Section');
const { Course } = require('../models/Course');
const { Submission } = require('../models/Submission');

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

		return res.status(200).send(section.students);
	},

	calculateStudentTotalGrade: async (req, res) => {
		// for each assigment in the section
		// get the student's submission if any * assigment %
		let student_id = req.params.student_id;
		let section_id = req.params.section_id;

		if (!(isValidObjectId(student_id) && isValidObjectId(section_id)))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id).populate('assignments');

		if (!section)
			return res.status(404).send("The section with the given ID was not found.");

		let student = await Student.findById(student_id);

		if (!student)
			return res.status(404).send("The student with the given ID was not found.");

		if (!student.studentSections.includes(section_id))
			return res.status(400).send("The student is not a student in this section");

		let totalGrade = 0;

		try {

			for (let assignment of section.assigments) {
				const { gradePercentage } = assignment;

				let submission = await
					Submission.findOne({ assignment, student: student_id });

				if (submission)
					totalGrade += (submission.grade * gradePercentage).toFixed(2);

			};

			return res.status(200).json({ student, totalGrade });
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	calculateAllStudentsTotalGrade: async (req, res) => {
		let section_id = req.params.section_id;

		if (!(isValidObjectId(student_id) && isValidObjectId(section_id)))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id).populate('students');

		if (!section)
			return res.status(404).send("The section with the given ID was not found.");

		const grades = [];

		try {
			// for each student
			for (let student of section.students) {
				let totalGrade = 0;

				for (let assignment of section.assignments) {
					const { gradePercentage } = assignment;

					let submission = await Submission.findOne({ assignment, student: student_id });
					if (submission)
						totalGrade += (submission.grade * gradePercentage).toFixed(2);
				}

				grades.push({
					student: _.pick(student, ['fullName', 'email']),
					totalGrade
				})
			}

			return res.status(200).json(grades);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
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

			const { CRN, capacity,
				semester, startDate, endDate, schedule,
				instructors, students, assignments } = req.body;

			section = new Section({
				course: course._id, CRN, capacity,
				semester, startDate, endDate, schedule,
				instructors, students, assignments
			});

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
				if (prop !== "section_id")
					section[prop] = req.body[prop];

			await section.save();

			return res.status(201).json(section);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	// also remove section from course
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