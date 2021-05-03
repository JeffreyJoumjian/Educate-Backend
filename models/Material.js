const { Schema, model } = require('mongoose'); const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const materialSchema = new Schema({
	path: { type: String, require: true, default: '/' },
	file: {
		fileName: { type: String, require: true },
		fileType: {
			type: String,
			enum: supportedFileTypes,
			require: true
		},
		data: { type: Buffer, require: true }
	}
});

const Material = model('Material', materialSchema);

function validateMaterialSchema() {
	return Joi.object({
		path: Joi.string().required(),

	});
}

module.exports = { Material, validateMaterialSchema };