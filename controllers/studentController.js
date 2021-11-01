const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Student } = require('../models/Student');
const { Section } = require('../models/Section');
const isValidObjectId = require('../utils/validateObjectId');

const studentController = {
	getAllStudents: async (req, res) => {
		return res.status(200).json(await Student.find().select('-password'));
	},

	getStudentById: async (req, res) => {
		let student_id = req.params.student_id;

		if (!isValidObjectId(student_id))
			return res.status(400).send("Invalid ID");

		let student = await Student.findById(student_id).select("-password").populate('studentSections');

		if (!student)
			return res.status(404).send("The student with the given ID was not found");

		return res.status(200).json(student);
	},

	createStudent: async (req, res) => {
		try {
			let student = await Student.findOne({ email: req.body.email });

			if (student)
				return res.status(400).send("The student with the given email already exists.");

			student = new Student(_.pick(req.body, ['fullName', 'email', 'password', 'phone', 'department', 'CGPA', 'studentSections']));

			student.password = await bcrypt.hash(student.password, 10);
			student = await student.save();

			return res.status(201).json(_.pick(student, ['_id', 'fullName', 'email', 'phone', 'department', 'CGPA', 'studentSections']));
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	updateStudentInfo: async (req, res) => {
		try {
			let student_id = req.body.student_id;

			if (!isValidObjectId(student_id))
				return res.status(400).send("Invalid ID");

			let student = await Student.findById(student_id);

			if (!student)
				return res.status(404).send('The student with the given ID was not found.');

			for (let prop in req.body) {
				if (prop !== "student_id" || prop !== "password")
					student[prop] = req.body[prop];
				if (prop === "password")
					student.password = await bcrypt.hash(req.boyd.password, 10);
			}

			await student.save();

			return res.status(201).json(_.pick(student, ['fullName', 'email', 'phone', 'department', 'CGPA', 'studentSections']));
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	deleteStudentById: async (req, res) => {
		try {
			let student_id = req.body.student_id;

			if (!isValidObjectId(student_id))
				return res.status(400).send("Invalid ID");

			let student = await Student.findByIdAndDelete(student_id);

			if (!student)
				return res.status(404).send("The student with the given ID was not found");

			return res.status(200).json(_.pick(student, ['fullName', 'email', 'phone', 'department', 'CGPA', 'studentSections']));
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	getStudentSections: async (req, res) => {
		try {
			let student_id = req.params.student_id;

			if (!isValidObjectId(student_id))
				return res.status(400).send("Invalid ID");

			let student = await Student
				.findById(student_id)
				.populate({
					path: 'studentSections',
					populate: { path: 'course' }
				});;

			if (!student)
				return res.status(404).send("The student with the given ID was");

			return res.status(200).json(student.studentSections);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},

	addStudentSection: async (req, res) => {
		try {
			let student_id = req.params.student_id;
			let section_id = req.params.section_id;

			if (!isValidObjectId(student_id) || !isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let student = await Student.findById(student_id);

			if (!student)
				return res.status(404).send("The instructor with the given ID was not found");

			let section = await Section.findById(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID was not found");

			if (student.studentSections.findIndex(section => section === section_id) === -1) {
				student.studentSections.push(section_id);
				section.students.push(student_id);
			}

			student = (await student.save()).populate('studentSections');
			section = await section.save();

			return res.status(201).json(student);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},
	removeStudentSection: async (req, res) => {
		try {
			let student_id = req.params.student_id;
			let section_id = req.params.section_id;

			if (!isValidObjectId(student_id) || !isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let student = await Instructor.findById(student_id);

			if (!student)
				return res.status(404).send("The instructor with the given ID was not found");

			let section = await Section.findById(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID was not found");

			// remove section from instructor teaching sections
			student.studentSections.splice(
				student.studentSections.findIndex(section => section === section_id), 1
			);

			// remove instructor from section's instructors
			section.students.splice(
				section.students.findIndex(instructor => instructor === student_id), 1
			);

			section.students.push(student_id);

			student = (await student.save()).populate('teachingSections');
			section = await section.save();

			return res.status(201).json(student);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},

};

module.exports = studentController;