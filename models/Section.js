const { Schema, model } = require('mongoose'); const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


// SUGGESTION maybe create a semester object
const sectionSchema = new Schema({
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course',
		require: true
	},
	CRN: {
		type: Number,
		require: true,
		unique: true,
	},
	semester: {
		type: String
	},
	startDate: {
		type: String,
	},
	endDate: {
		type: String,
	},
	schedule: {
		type: String
	},
	instructors: {
		type: [Schema.Types.ObjectId],
		ref: 'Instructor'
	},
	students: {
		type: [Schema.Types.ObjectId],
		ref: 'Student'
	},
	assignments: {
		type: [Schema.Types.ObjectId],
		ref: 'Assignment'
	}

});

const Section = model('Section', sectionSchema);

function validateSectionSchema() {
	return Joi.object({
		course: Joi.objectId().required(),
		CRN: Joi.number().required(),
		semester: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		schedule: Joi.string(),
		instructors: Joi.array().items(Joi.objectId()),
		students: Joi.array().items(Joi.objectId())
	});
}

module.exports = { Section, validateSectionSchema };