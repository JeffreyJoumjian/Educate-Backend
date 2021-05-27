const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { format } = require('date-fns');

// const { supportedFileTypes } = require('../utils/universityData');

const submissionSchema = new Schema({
	assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
	student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
	grade: { type: Number, min: 0, max: 100, default: 0 },
	isGraded: { type: Boolean, default: false },
	textSubmission: { type: String },
	comments: { type: String },
	date: { type: String },
	files: [{
		name: { type: String, required: true },
		size: { type: Number, required: true },
		type: {
			type: String,
			// enum: supportedFileTypes,
			required: true
		},
		data: { type: Buffer, required: true }
	}]

});

submissionSchema.pre('save', function () {
	if (!this.date) {
		this.date = format(Date.now(), "dd/MM/yyyy p");
	}
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