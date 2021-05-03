const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Instructor } = require('../models/Instructor');
const isValidObjectId = require('../utils/validateObjectId');

const instructorController = {
	getAllInstructors: async (req, res) => {
		res.status(200).json(await Instructor.find());
	},

	getInstructorById: async (req, res) => {
		let instructor_id = req.params.instructor_id;

		if (!isValidObjectId(instructor_id))
			return res.status(400).send("Invalid ID");

		let instructor = await Instructor.findById(instructor_id);

		if (!instructor)
			return res.status(404).send('The instructor with the given id was not found');


		return res.status(200).json(_.pick(instructor, ['_id', 'fullName', 'title', 'email', 'password', 'phone', 'teachingCourses', 'department']));
	},

	createInstructor: async (req, res) => {

		try {
			let instructor = await Instructor.findOne({ email: req.body.email })

			if (instructor)
				return res.status(409).send('Instructor with the given email already exists');

			instructor = new Instructor(_.pick(req.body, ['fullName', 'title', 'email', 'password', 'phone', 'teachingCourses', 'department']));


			instructor.password = await bcrypt.hash(instructor.password, 10);
			instructor = await instructor.save();

			return res.status(200).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingCourses", "department"]));
		}
		catch (e) {
			return res.status(400).send(e.message);
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


			// await validateInstructorSchema.validateAsync(validateInstructorSchema(false));

			for (let prop in req.body) {
				if (prop !== "instructor_id" || prop !== "password")
					instructor[prop] = req.body[prop];
				if (prop === "password")
					instructor.password = await bcrypt.hash(instructor.password, 10);
			}

			await instructor.save();

			return res.status(204).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingCourses", "department"]));
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

			return res.status(200).json(_.pick(instructor, ['_id', "fullName", "email", "phone", "title", "teachingCourses", "department"]));
		}
		catch (e) {
			res.status(400).send(e.message);
		}
	}

	// TODO add and remove courses from instructor

}

module.exports = instructorController;
