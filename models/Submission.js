const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { supportedFileTypes } = require('../utils/universityData');

const submissionSchema = new Schema({
	assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
	student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
	grade: { type: Number, min: 0, max: 100, default: 0 },
	isGraded: { type: Boolean, default: false },
	comments: { type: String },
	date: { type: String, default: (new Date()).toUTCString() },
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

const Submission = model('Submission', submissionSchema);

function validateSubmissionSchema(isNew = true) {
	return Joi.object({
		submission_id: !isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		assignment: isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		student: isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		grade: Joi.number(),
		isGraded: Joi.boolean(),
		comments: Joi.string().optional(),
		date: Joi.string(),
		files: Joi.any()
	});
}

module.exports = { Submission, validateSubmissionSchema };