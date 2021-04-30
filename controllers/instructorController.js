const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Instructor, validateInstructorSchema } = require('../models/Instructor');
const isValidObjectId = require('../utils/validateObjectId');

const instructorController = {
	getAllInstructors: async (req, res) => {
		res.status(200).send(await Instructor.find());
	},

	getInstructorById: async (req, res) => {
		let instructor_id = req.body.instructor_id;

		if (!isValidObjectId(instructor_id))
			return res.status(400).send("invalid ID");

		let instructor = await Instructor.findById(instructor_id);

		if (!instructor)
			return res.status(404).send('the instructor with the given id was not found');


		res.status(200).json(instructor);
	},

	createInstructor: async (req, res) => {

		try {
			let instructor = await Instructor.findOne({ email: req.body.email })

			if (instructor)
				return res.status(200).send('Instructor with the given email already exists');

			instructor = new Instructor(
				_.pick(req.body,
					['fullName', 'title', 'email', 'password', 'phone', 'teachingCourses', 'department']
				));


			instructor.password = await bcrypt.hash(instructor.password, await bcrypt.genSalt(10));
			instructor = await instructor.save();
			res.status(200).json(instructor);
		}
		catch (e) {
			res.status(400).send(e.message);
		}


	},

	updateInstructorInfo: async (req, res) => {

		try {
			let instructor_id = req.body.instructor_id;

			if (!isValidObjectId(instructor_id))
				res.status(400).send("Invalid ID");

			let instructor = await Instructor.findById(instructor_id);

			if (!instructor)
				return res.status(404).send('the instructor with the given id was not found');


			// await validateInstructorSchema.validateAsync(validateInstructorSchema(false));

			for (let prop in req.body) {
				if (prop !== "instructor_id")
					instructor[prop] = req.body[prop];
			}

			await instructor.save();

			res.status(200).json(_.pick(instructor, ["fullName", "email", "phone", , "title", "teachingCourses", "department"]));
		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	}

}

module.exports = instructorController;
