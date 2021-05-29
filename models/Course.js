const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { departments } = require('../utils/universityData');


const courseSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	code: { type: String, required: true, unique: true },
	description: { type: String },
	credits: { type: Number, required: true, min: 1, max: 5, default: 3 },
	department: { type: String, enum: departments }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourseSchema(isNew = true) {
	return Joi.object({
		course_id: !isNew ? Joi.objectId().required() : Joi.objectId(),
		name: isNew ? Joi.string().required() : Joi.string(),
		code: isNew ? Joi.string().required() : Joi.string(),
		description: Joi.string(),
		credits: Joi.number().min(1).max(5),
		department: Joi.string().valid(...departments)
	});

}


module.exports = { Course, validateCourseSchema };