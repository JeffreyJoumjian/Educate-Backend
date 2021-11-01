const router = require('express').Router();

const { Assignment } = require('../models/Assignment');
const { Course } = require('../models/Course');
const { Instructor } = require('../models/Instructor');
const { Section } = require('../models/Section');
const { Student } = require('../models/Student');
const { Submission } = require('../models/Submission');

const winston = require('winston');
const fs = require('fs');

router.delete('/all', async (req, res) => {
	try {

		winston.error(await Assignment.find());
		winston.error(await Instructor.find());
		winston.error(await Course.find());
		winston.error(await Section.find());
		winston.error(await Student.find());
		winston.error(await Submission.find());




		await Assignment.deleteMany();
		await Course.deleteMany();
		await Instructor.deleteMany();
		await Section.deleteMany();
		await Student.deleteMany();
		await Submission.deleteMany();

		await Assignment.collection.dropIndexes();
		await Course.collection.dropIndexes();
		await Instructor.collection.dropIndexes();
		await Section.collection.dropIndexes();
		await Student.collection.dropIndexes();
		await Submission.collection.dropIndexes();

		return res.status(201).send("Successfully deleted everything");
	}
	catch (e) {
		return res.status(500).send(e.message);
	}
});


module.exports = router;