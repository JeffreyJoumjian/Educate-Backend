const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { departments } = require('../utils/universityData');

const studentSchema = new Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, minlength: 8, maxlength: 15 },
	password: { type: String, required: true },
	department: { type: String, enum: departments },
	CGPA: { type: Number, min: 0.0, max: 4.0, default: 4.0 },
	studentSections: [{ type: Schema.Types.ObjectId, ref: 'Section' }]
});

// add email uniqueness checking
// studentSchema.methods.generateEmail = async function () {
// 	this.email = this.fullName.split(" ").join(".") + "@student.edu";
// 	// let student = await mongoose.model('Student').findOne({email: this.email});
// 	// if(student)

// }

const Student = model('Student', studentSchema);

function validateStudentSchema(isNew = true) {
	return Joi.object({
		student_id: !isNew ? Joi.objectId().required() : Joi.objectId().optional(),
		fullName: isNew ? Joi.string().required() : Joi.string(),
		email: isNew ? Joi.string().required() : Joi.string(),
		phone: isNew ? Joi.string().required() : Joi.string(),
		password: isNew ? Joi.string().required() : Joi.string(),
		department: Joi.string().valid(...departments),
		CGPA: Joi.number().min(0.0).max(4.0),
		studentSections: Joi.array().items(Joi.objectId())
	});
}

module.exports = { Student, validateStudentSchema };