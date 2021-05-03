const _ = require('lodash');
const isValidObjectId = require('../utils/validateObjectId');

const { Assignment } = require('../models/Assignment');

const assignmentController = {
	getAllAssignments: async (req, res) => {
		return res.status(200).send(await Assignment.find());
	},

	getAssignmentById: async (req, res) => {

	},

	getAssignmentsBySectionId: async (req, res) => {

	},

	createAssignment: async (req, res) => {

	},

	updateAssignmentInfo: async (req, res) => {

	},

	deleteAssignmentById: async (req, res) => {

	}
}

module.exports = assignmentController;