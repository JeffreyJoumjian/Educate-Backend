const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const hierarchyTypes = ['folder', 'assignment', 'file'];

const fileHierarchySchema = new Schema({
	path: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, enum: hierarchyTypes },
	data: { type: Schema.Types.ObjectId, ref: 'File' },
	children: [this]
});

const FileHierarchy = model('FileHierarchy', fileHierarchySchema);

function validateFileHierarchySchema(isNew = true) {
	const schema = Joi.object({
		path: Joi.string().required(),
		name: Joi.string().required(),
		type: Joi.string().valid(...hierarchyTypes),
		data: Joi.objectId(),
		children: Joi.array().items(Joi.link(() => schema))
	});

	return schema;
}

module.exports = { FileHierarchy, validateFileHierarchySchema };