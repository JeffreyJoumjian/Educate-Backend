const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Assignment } = require('../models/Assignment');

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

// fileHierarchySchema.pre('save', function () {
// 	if (this.type === "folder" && !this.children)
// 		this.children = [];

// 	if (this.path !== "/") {
// 		if (this.path[this.path.length - 1] === "/")
// 			this.path = this.path.substring(0, this.path.length - 1);
// 		if (this.path[0] === "/")
// 			this.path = this.path.substring(1, this.path.length);
// 	}
// });

// fileHierarchySchema.pre('save', function(){
// 	if(this.type==="assignment"){
// 		let assignment = await Assignment.findById(this.data);

// 		if(!assignment){

// 		}
// 	}
// });

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