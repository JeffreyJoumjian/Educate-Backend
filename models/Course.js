const mongoose = require('mongoose');
const Joi = require('joi');
const { departments } = require('../utils/departments');


const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
		unique: true
	},
	description: {
		type: String
	},
	credits: {
		type: Number,
		require: true,
		min: 1,
		max: 5,
		default: 3
	},
	department: {
		type: String,
		enum: departments
	}
});

const Course = mongoose.model('Course', courseSchema);

function validateCourseSchema() {
	return Joi.object({
		name: Joi.string().required(),
		description: Joi.string(),
		credits: Joi.number().required().min(1).max(5),
		department: Joi.string().valid(...departments)
	});

}


module.exports = { Course, validateCourseSchema };