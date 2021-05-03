const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { semesters } = require('../utils/universityData');

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
	capacity: { type: Number, min: 1, max: 40, default: 20 },
	semester: { type: String, enum: semesters },
	startDate: { type: String, },
	endDate: { type: String, },
	schedule: { type: String },
	instructors: { type: [Schema.Types.ObjectId], ref: 'Instructor' },
	students: { type: [Schema.Types.ObjectId], ref: 'Student' },
	assignments: { type: [Schema.Types.ObjectId], ref: 'Assignment' }

});

const Section = model('Section', sectionSchema);

// note that when it's an update => isNew=false and doc id is required to update
function validateSectionSchema(isNew = true) {
	return Joi.object({
		section_id: !isNew ? Joi.objectId().required() : Joi.objectId(),
		course_id: isNew ? Joi.objectId().required() : Joi.objectId(),
		CRN: isNew ? Joi.number().required() : Joi.number(),
		semester: Joi.string().valid(...semesters),
		startDate: Joi.string(),
		endDate: Joi.string(),
		schedule: Joi.string(),
		instructors: Joi.array().items(Joi.objectId()),
		students: Joi.array().items(Joi.objectId())
	});
}

module.exports = { Section, validateSectionSchema };