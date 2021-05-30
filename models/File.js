const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const fileSchema = new Schema({
	section: { type: Schema.Types.ObjectId, ref: 'Section' },
	name: { type: String, required: true },
	size: { type: Number, required: true },
	type: {
		type: String,
		// enum: supportedFileTypes,
		required: true
	},
	data: { type: Buffer, required: true }
});

const File = model('File', fileSchema);

function validateFileSchema(isNew) {
	return Joi.object({
		name: Joi.string().required(),
		size: Joi.number().required(),
		type: Joi.string().required(),
		data: Joi.any().required()
	});
}

module.exports = { FileSchema: fileSchema, File, validateFileSchema };