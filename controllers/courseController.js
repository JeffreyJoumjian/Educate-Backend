const _ = require('lodash');

const { Course } = require('../models/Course');
const isValidObjectId = require('../utils/validateObjectId');

const courseController = {
	getAllCourses: async (req, res) => {
		res.status(200).send(await Course.find());
	},
	getCourseById: async (req, res) => {
		let course_id = req.params.instructor_id;

		if (!isValidObjectId(course_id))
			return res.status(400).send("Invalid ID");

		let course = await Course.findById(course_id);

		if (!course)
			return res.status(404).send("The course with the given ID was not found.");

		return res.status(200).json(course);
	},
	createCourse: async (req, res) => {
		try {
			// check if course already exists
			let course = await Course.findOne({
				$or: [
					{ name: req.body.name },
					{ code: req.body.code }
				]
			});

			if (course)
				return res.status(409).send("Course with the given name or nameNumber already exists.");

			course = new Course(
				_.pick(req.body, ['name', 'code', 'description', 'credits', 'department'])
			);

			course = await course.save();

			return res.status(201).json(course);

		}
		catch (e) {
			return res.status(400).send(e.message);
		}
	},
	updateCourseInfo: async (req, res) => {
		try {
			let course_id = req.body.course_id;

			if (!isValidObjectId(course_id))
				res.status(400).send("Invalid ID");

			let course = await Course.findById(course_id);

			if (!course)
				res.status(404).send("Course with the given ID was not found.");

			for (let prop in req.body)
				course[prop] = req.body[prop];

			await course.save();

			return res.status(204).json(course);

		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	},
	deleteCourseById: async (req, res) => {
		try {
			let course_id = req.body.course_id;

			if (!isValidObjectId(course_id))
				return res.status(400).send("Invalid ID");

			let course = await Course.findByIdAndDelete(course_id);

			if (!course)
				return res.status(404).send("Course with the given ID was not found");

			return res.status(204).json(course);
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	}
}

module.exports = courseController;