const { Schema, model } = require('mongoose'); const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const materialSchema = new Schema({
	path: { type: String, required: true, default: '/' },
	file: {
		fileName: { type: String, required: true },
		fileType: {
			type: String,
			enum: supportedFileTypes,
			required: true
		},
		data: { type: Buffer, required: true }
	}
});

const Material = model('Material', materialSchema);

function validateMaterialSchema() {
	return Joi.object({
		path: Joi.string().required(),

	});
}

module.exports = { Material, validateMaterialSchema };