const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const supportedFileTypes = ['pdf', 'png', 'jpg', 'txt'];
const assignentTypes = ['exam', 'quiz', 'paper', 'project', 'assignment'];
const assignmentVisibilityTypes = ["manual", "automatic"];

const assignmentSchema = new Schema({
	section: { type: Schema.Types.ObjectId, ref: 'Section' },
	name: { type: String, require: true },
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
	startDate: { type: String, require: true },
	startTime: { type: String, require: true },
	endDate: { type: String, require: true },
	endTime: { type: String, require: true },
	isActive: { type: Boolean, default: true },
	visibility: { type: String, enum: assignmentVisibilityTypes },
	isVisible: { type: Boolean, default: true },
	allowLateSubmissions: { type: Boolean, default: false },
	allowMultipleSubmission: { type: Boolean, default: true },
	path: { type: String, require: true, default: '/' },
	files: [{
		fileName: { type: String, require: true },
		fileType: {
			type: String,
			enum: supportedFileTypes,
			require: true
		},
		data: { type: Buffer, require: true }
	}]
});

const Assignment = model('Assigment', assignmentSchema);

function validateAssignmentSchema() {
	return Joi.object({
		section: Joi.objectId().required(),
		name: Joi.string().required(),
		description: Joi.string(),
		type: Joi.string().valid(...assignentTypes),
		maxGrade: Joi.number().min(0).max(100),
		gradePercentage: Joi.number().min(0).max(100),
		startDate: Joi.string().required(),
		startTime: Joi.string().required(),
		endDate: Joi.string().required(),
		endTime: Joi.string().required(),
		visibility: Joi.string().valid(...assignmentVisibilityTypes),
		isVisible: Joi.boolean(),
		allowLateSubmissions: Joi.boolean(),
		allowMultipleSubmissions: Joi.boolean(),
		files: Joi.any()
	});
}

module.exports = { Assignment, validateAssignmentSchema };