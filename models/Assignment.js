const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { supportedFileTypes } = require('../utils/universityData');
const assignentTypes = ['exam', 'quiz', 'paper', 'project', 'assignment'];
const assignmentVisibilityTypes = ["manual", "automatic"];

const assignmentSchema = new Schema({
	section: { type: Schema.Types.ObjectId, ref: 'Section' },
	name: { type: String, required: true },
	description: { type: String },
	type: { type: String, enum: assignentTypes },
	maxGrade: {
		type: Number,
		min: 0,
		max: 100,
		default: 100
	},
	gradePercentage: {
		type: Number,
		min: 0,
		max: 100,
		default: 10
	},
	startDate: { type: String, required: true },
	startTime: { type: String, required: true },
	endDate: { type: String, required: true },
	endTime: { type: String, required: true },
	isActive: { type: Boolean, default: true },
	visibility: { type: String, enum: assignmentVisibilityTypes },
	isVisible: { type: Boolean, default: true },
	allowLateSubmissions: { type: Boolean, default: false },
	allowMultipleSubmission: { type: Boolean, default: true },
	path: { type: String, required: true, default: '/' },
	files: [{
		fileName: { type: String, required: true },
		fileType: {
			type: String,
			enum: supportedFileTypes,
			required: true
		},
		data: { type: Buffer, required: true }
	}]
});

const Assignment = model('Assigment', assignmentSchema);

function validateAssignmentSchema(isNew = true) {
	return Joi.object({
		assignment_id: !isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		section: isNew ? Joi.objectId().required() : Joi.objectId(),
		name: isNew ? Joi.string().required() : Joi.string(),
		description: Joi.string(),
		type: Joi.string().valid(...assignentTypes),
		maxGrade: Joi.number().min(0).max(100),
		gradePercentage: Joi.number().min(0).max(100),
		startDate: isNew ? Joi.string().required() : Joi.string(),
		startTime: isNew ? Joi.string().required() : Joi.string(),
		endDate: isNew ? Joi.string().required() : Joi.string(),
		endTime: isNew ? Joi.string().required() : Joi.string(),
		visibility: Joi.string().valid(...assignmentVisibilityTypes),
		isVisible: Joi.boolean(),
		allowLateSubmissions: Joi.boolean(),
		allowMultipleSubmissions: Joi.boolean(),
		files: Joi.any()
	});
}

module.exports = { Assignment, validateAssignmentSchema };