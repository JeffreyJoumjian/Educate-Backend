const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Instructor } = require('../models/Instructor');
const { Section } = require('../models/Section');
const isValidObjectId = require('../utils/validateObjectId');

const instructorController = {
	getAllInstructors: async (req, res) => {
		return res.status(200).json(await Instructor.find().select('-password'));
	},

	getInstructorById: async (req, res) => {
		let instructor_id = req.params.instructor_id;

		if (!isValidObjectId(instructor_id))
			return res.status(400).send("Invalid ID");

		let instructor = await Instructor.findById(instructor_id);

		if (!instructor)
			return res.status(404).send('The instructor with the given ID was not found');


		return res.status(200).json(_.pick(instructor, ['_id', 'fullName', 'title', 'email', 'phone', 'teachingSections', 'department']));
	},

	createInstructor: async (req, res) => {

		try {
			let instructor = await Instructor.findOne({ email: req.body.email })

			if (instructor)
				return res.status(409).send('Instructor with the given email already exists');

			instructor = new Instructor(_.pick(req.body, ['fullName', 'title', 'email', 'password', 'phone', 'teachingSections', 'department']));


			instructor.password = await bcrypt.hash(instructor.password, 10);
			instructor = await instructor.save();

			return res.status(200).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingSections", "department"]));
		}
		catch (e) {
			return res.status(500).send(e.message);
		}


	},

	updateInstructorInfo: async (req, res) => {

		try {
			let instructor_id = req.body.instructor_id;

			if (!isValidObjectId(instructor_id))
				return res.status(400).send("Invalid ID");

			let instructor = await Instructor.findById(instructor_id);

			if (!instructor)
				return res.status(404).send('The instructor with the given ID was not found');

			for (let prop in req.body) {
				if (prop !== "instructor_id" || prop !== "password")
					instructor[prop] = req.body[prop];
				if (prop === "password")
					instructor.password = await bcrypt.hash(req.body.password, 10);
			}

			await instructor.save();

			return res.status(201).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingSections", "department"]));
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},

	deleteInstructorById: async (req, res) => {
		try {
			let instructor_id = req.body.instructor_id;

			if (!isValidObjectId(instructor_id))
				return res.status(400).send("Invalid ID");

			let instructor = await Instructor.findByIdAndDelete(instructor_id);

			if (!instructor)
				return res.status(404).send("The instructor with the given ID was not found")

			return res.status(200).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingSections", "department"]));
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},

	getTeachingSections: async (req, res) => {
		try {
			let instructor_id = req.params.instructor_id;

			if (!isValidObjectId(instructor_id))
				return res.status(400).send("Invalid ID");

			let instructor = await Instructor.findById(instructor_id).populate('teachingSections');

			if (!instructor)
				return res.status(404).send("The instructor with the given ID was not found")

			return res.status(200).json(instructor.teachingSections);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},

	addTeachingSection: async (req, res) => {
		try {
			let instructor_id = req.params.instructor_id;
			let section_id = req.params.section_id;

			if (!isValidObjectId(instructor_id) || !isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let instructor = await Instructor.findById(instructor_id);

			if (!instructor)
				return res.status(404).send("The instructor with the given ID was not found");

			let section = await Section.findById(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID was not found");

			if (instructor.teachingSections.findIndex(section => section === section_id) === -1) {
				instructor.teachingSections.push(section_id);
				section.instructors.push(instructor_id);
			}

			instructor = (await instructor.save()).populate('teachingSections');
			section = await section.save();

			return res.status(201).json(instructor);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},
	removeTeachingSection: async (req, res) => {
		try {
			let instructor_id = req.params.instructor_id;
			let section_id = req.params.section_id;

			if (!isValidObjectId(instructor_id) || !isValidObjectId(section_id))
				return res.status(400).send("Invalid ID");

			let instructor = await Instructor.findById(instructor_id);

			if (!instructor)
				return res.status(404).send("The instructor with the given ID was not found");

			let section = await Section.findById(section_id);

			if (!section)
				return res.status(404).send("The section with the given ID was not found");

			// remove section from instructor teaching sections
			instructor.teachingSections.splice(
				instructor.teachingSections.findIndex(section => section === section_id), 1
			);

			// remove instructor from section's instructors
			section.instructors.splice(
				section.instructors.findIndex(instructor => instructor === instructor_id), 1
			);

			section.instructors.push(instructor_id);

			instructor = (await instructor.save()).populate('teachingSections');
			section = await section.save();

			return res.status(201).json(instructor);
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},

	// TODO add and remove courses from instructor
}

module.exports = instructorController;
