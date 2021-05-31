const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { format } = require('date-fns');
const { FileSchema } = require('./File');

// const { supportedFileTypes } = require('../utils/universityData');

const submissionSchema = new Schema({
	assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
	student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
	grade: { type: Number, min: 0, max: 100, default: 0 },
	isGraded: { type: Boolean, default: false },
	textSubmission: { type: String },
	comments: { type: String },
	date: { type: String },
	files: [FileSchema]

});

submissionSchema.pre('save', function () {
	let currentDate = format(Date.now(), 'dd/MM/yyyy p').split(" ");
	let currTime = currentDate[1].split(":");

	currTime[0] = currTime[0].length === 1 ? "0" + currTime[0] : currTime[0];

	currTime = currTime.join(":");
	currentDate[1] = currTime;
	currentDate = currentDate.join(" ");

	this.date = currentDate;
});

const Submission = model('Submission', submissionSchema);

function validateSubmissionSchema(isNew = true) {
	return Joi.object({
		submission_id: !isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		assignment_id: isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		student_id: isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		grade: Joi.number(),
		isGraded: Joi.boolean(),
		textSubmission: Joi.string(),
		comments: Joi.string().optional(),
		date: Joi.string(),
		files: Joi.any()
	});
}

module.exports = { Submission, validateSubmissionSchema };