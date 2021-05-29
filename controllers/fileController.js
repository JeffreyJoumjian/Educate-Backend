const _ = require('lodash');

const { File } = require('../models/File');
const { Section } = require('../models/Section');
const { Assignment } = require('../models/Assignment');
const { FileHierarchy } = require('../models/FileHierarchy');
const isValidObjectId = require('../utils/validateObjectId');

const fileController = {
	// partent is either an assignment or a submission to an assignment
	attachFiles: (req, res, parent, clearFiles = false) => {
		if (clearFiles)
			parent.files = [];

		// get uploaded files
		let sentFiles = [];
		sentFiles.push(req.files.files);
		sentFiles = sentFiles.flat(1); // flatten files to 1 array


		sentFiles.forEach(sentFile => {
			const { name, mimetype: type, size, data } = sentFile;

			// overwrite duplicates by removing them
			parent.files = parent.files.filter(file => file.name !== sentFile.name);

			parent.files.push({
				name, type, size, data
			});
		});
	},
	removeFiles: (req, res, parent, filesNames) => {
		parent.files = parent.files.filter(file => !filesNames.includes(file.name));
	},

	getFileHierarchy: async (req, res) => {
		let { section_id } = req.params;
		let { path } = req.query;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("Section with the given ID was not found");

		if (!path)
			return res.status(400).send("Path cannot be empty");

		let fileHierarchy = section.fileHierarchy;


		path = cleanPath(path);

		if (path === "root")
			return res.status(200).json(fileHierarchy);

		// while there are children fileHierarchies
		while (fileHierarchy) {
			if (path === fileHierarchy.path)
				return res.status(200).json(fileHierarchy);

			// check if path is a subtring of one of the child paths
			fileHierarchy = fileHierarchy.children.find(child => path.includes(child.path));
		}

		if (!fileHierarchy)
			return res.status(404).send("path not found");

	},

	addToHierarchy: async (req, res) => {
		const {
			section: section_id,
			type,
			name,
		} = req.body;

		let parentPath = req.body.parentPath;

		const sentFile = req?.files?.sentFile;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("Section with the given ID was not found");

		parentPath = cleanPath(parentPath);
		if (!parentPath)
			return res.status(400).send("Path cannot be empty");



		let assignment;
		if (type == "assignment") {
			assignment = req.body.assignment;

			if (!assignment)
				return res.status(404).send("The Assignment with the given ID was not found.");
		}

		if (type == "file" && !sentFile)
			return res.status(400).send("File cannot be empty");

		// try {


		let currHierarchy = section.fileHierarchy;

		while (currHierarchy) {
			if (parentPath === currHierarchy.path) {

				let data;
				let path = `${parentPath}/${name}`;

				if (type === "folder") {
					data = null;

					// if folder already exists in directory
					let folder = currHierarchy.children.find(child => child.path === path);

					if (folder)
						return res.status(400).send("A folder with the same name already exists.");
				}
				else if (type === "assignment") {
					data = assignment._id;
				}
				else if (type === "file") {
					const { name: fileName, mimetype, size, data: fileData } = sentFile;


					// if file already exists in directory
					let file = currHierarchy.children.find(child => child.path === path);

					if (file)
						return res.status(400).send("A file with the same name already exists.");

					file = new File({ name: fileName, type: mimetype, size, fileData });

					file = await file.save();

					data = file._id;
				}
				else {
					return res.status(400).send(`${type} is an invalid file type`);
				}


				let newHierarchyObject = new FileHierarchy({
					path,
					name,
					type,
					data,
					children: type === "folder" ? [] : undefined
				});

				currHierarchy.children.push(newHierarchyObject);

				section.markModified('fileHierarchy');
				section = await section.save();

				return res.status(201).json({ hierarchy: currHierarchy, assignment });
			}

			currHierarchy = currHierarchy.children.find(child => parentPath.includes(child.path));
		}

		if (!currHierarchy)
			return res.status(404).send("path not found");

		// } catch (e) {
		// 	return res.status(500).send("Internal server error");
		// }
	},

	// FIX deleting an assignment should also delete it in the hierarchy
	deleteFromHierarchy: async (req, res) => {
		const { section_id, path } = req.body;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("Section with the given ID was not found");

		if (!path) {
			return res.status(400).send("path cannot be empty");
		}

		// find path and recursively delete its elements
		let fileHierarchy = section.fileHierarchy;

		const filesToDelete = [];

		while (fileHierarchy) {
			if (fileHierarchy.path === path) {
				recurseStructure(fileHierarchy, filesToDelete);

				for (let i = 0; i < filesToDelete.length; i++) {
					let file = filesToDelete[i];

					if (file.type === "assignment")
						await Assignment.findByIdAndDelete(file.data);
					if (file.type === "file")
						await File.findByIdAndDelete(file.data);
				}

				await section.fileHierarchy.children.pull(fileHierarchy._id);

				section.markModified('fileHierarchy');
				section = await section.save();

				return res.status(200).json({ hierarchy: section.fileHierarchy, assignment: req.body.assignment });
			}

			fileHierarchy = fileHierarchy.children.find(child => path.includes(child.path));
		}

		if (!fileHierarchy)
			return res.status(404).send("path not found");
	},

}

function recurseStructure(fileHierarchy, filesToDelete) {

	if (fileHierarchy.children.length === 0) {
		let obj = {
			path: fileHierarchy.path,
			data: fileHierarchy.data,
			type: fileHierarchy.type
		}
		filesToDelete.push(obj);
		return;
	}

	if (fileHierarchy.children.length > 0)
		fileHierarchy.children.forEach(child => recurseStructure(child, filesToDelete));

}

function cleanPath(path) {

	if (!path)
		path = "root";

	if (path[path.length - 1] === "/")
		path = path.substring(0, path.length - 1);
	if (path[0] === "/")
		path = path.substring(1, path.length);
	return path;
}


module.exports = fileController;