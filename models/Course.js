const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { departments } = require('../utils/universityData');


const courseSchema = new mongoose.Schema({
	name: { type: String, require: true, unique: true },
	nameNumber: { type: String, require: true, unique: true },
	description: { type: String },
	credits: {
		type: Number,
		require: true,
		min: 1,
		max: 5,
		default: 3
	},
	department: { type: String, enum: departments }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourseSchema(isNew = true) {
	return Joi.object({
		course_id: !isNew ? Joi.objectId().required() : Joi.objectId(),
		name: isNew ? Joi.string().required() : Joi.string(),
		nameNumber: isNew ? Joi.string().required() : Joi.string(),
		description: Joi.string(),
		credits: isNew ? Joi.number().required().min(1).max(5) : Joi.number().required().min(1).max(5),
		department: Joi.string().valid(...departments)
	});

}


module.exports = { Course, validateCourseSchema };