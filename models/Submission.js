const { Schema, model } = require('mongoose'); const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const submissionSchema = new Schema({
	assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', require: true },
	student: { type: Schema.Types.ObjectId, ref: 'Student', require: true },
	grade: { type: Number, min: 0, max: 100, default: 0, require: true },
	comments: { type: String }

});

const Submission = model('Submission', submissionSchema);

function validateSubmissionSchema() {
	return Joi.object({
		assignment: Joi.objectId().required(),
		student: Joi.objectId().required(),
		grade: Joi.number().required(),
		comments: Joi.string().optional()
	});
}

module.exports = { Submission, validateSubmissionSchema };