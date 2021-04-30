const mongoose = require('mongoose');
const Joi = require('joi');


const courseSchema = new mongoose.Schema({

});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
	const schema = {
		name: Joi.string().required()
	}

	return Joi.validate(course, schema, { allowUnknown: true });
}


module.exports = { Course, validateCourse };