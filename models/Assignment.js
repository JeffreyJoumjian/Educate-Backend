const { isBefore, isAfter, parse, parseISO, format } = require('date-fns');
const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { FileSchema } = require('../models/File');

const assignmentTypes = ['exam', 'quiz', 'paper', 'project', 'assignment'];
const assignmentVisibilityTypes = ["manual", "automatic"];

const assignmentSchema = new Schema({
	section: { type: Schema.Types.ObjectId, ref: 'Section' },
	name: { type: String, required: true, unique: true },
	description: { type: String },
	type: { type: String, enum: assignmentTypes },
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
	visibility: { type: String, enum: assignmentVisibilityTypes, default: "automatic" },
	isVisible: { type: Boolean, default: true },
	allowLateSubmissions: { type: Boolean, default: false },
	allowMultipleSubmissions: { type: Boolean, default: true },
	files: [{ type: FileSchema }]
}, { timestamps: true });

assignmentSchema.methods.setIsActive = function () {
	// let date1 = parse("04/07/2021 04:58 PM", "dd/MM/yyyy p", Date.now());
	// let date2 = parse("04/07/2021 04:58 PM", "dd/MM/yyyy p", Date.now());

	let startDate = parse(`${this.startDate} ${this.startTime}`, 'dd/MM/yyyy p', Date.now());
	let endDate = parse(`${this.endDate} ${this.endTime}`, 'dd/MM/yyyy p', Date.now());
	let currentDate = parseISO(new Date().toISOString(), "dd/MM/yyyy p");

	if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate))
		return this.isActive = true;

	return this.isActive = false;
};

assignmentSchema.pre('save', function () {
	this.setIsActive();
});

const Assignment = model('Assignment', assignmentSchema);


function validateAssignmentSchema(isNew = true) {
	return Joi.object({
		assignment_id: !isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		section: isNew ? Joi.objectId().required() : Joi.objectId(),
		name: isNew ? Joi.string().required() : Joi.string(),
		description: Joi.string(),
		type: Joi.string().valid(...assignmentTypes),
		maxGrade: Joi.number().min(0).max(100),
		gradePercentage: Joi.number().min(0).max(100),
		startDate: isNew ? Joi.string().required() : Joi.string(),
		startTime: isNew ? Joi.string().required() : Joi.string(),
		endDate: isNew ? Joi.string().required() : Joi.string(),
		endTime: isNew ? Joi.string().required() : Joi.string(),
		isActive: Joi.boolean(),
		visibility: Joi.string().valid(...assignmentVisibilityTypes),
		isVisible: Joi.boolean(),
		allowLateSubmissions: Joi.boolean(),
		allowMultipleSubmissions: Joi.boolean(),
		files: Joi.any(),
		parentPath: Joi.string().optional()
	});
}

module.exports = { Assignment, validateAssignmentSchema };