const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const hierarchyTypes = ['folder', 'assignment', 'file'];
const dataTypes = [null, 'Assignment', 'File'];

const fileHierarchySchema = new Schema({
	_id: { type: Schema.Types.ObjectId },
	path: { type: String, required: true, default: "root" },
	name: { type: String },
	type: { type: String, enum: hierarchyTypes },
	mimetype: { type: String },
	data: {
		type: Schema.Types.ObjectId,
		refPath: 'typeOfData'
	},
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

module.exports = { FileHierarchySchema: fileHierarchySchema, FileHierarchy, validateFileHierarchySchema };