const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { departments, titles } = require('../utils/departments');

const instructorSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	title: {
		type: [String],
		enum: titles
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		minlength: 8,
		maxlength: 15
	},
	password: {
		type: String,
		required: true
	},
	teachingCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
	department: {
		type: String,
		enum: departments
	}
}, {
	collection: 'instructors'
});

const Instructor = model('Instructor', instructorSchema);

function validateInstructorSchema(isNew) {

	return Joi.object({
		instructor_id: isNew ? Joi.objectId().optional() : Joi.objectId().required(),
		fullName: isNew ? Joi.string().required() : Joi.string(),
		email: isNew ? Joi.string().required() : Joi.string(),
		password: isNew ? Joi.string().required() : Joi.string(),
		phone: Joi.string(),
		title: Joi.string() || Joi.array().items(Joi.string()),
		teachingCourses: Joi.array().items(Joi.objectId()),
		department: Joi.string()
	});
}


module.exports = { Instructor, validateInstructorSchema }