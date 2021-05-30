const _ = require('lodash');
const { File } = require('../models/File');
const { Section } = require('../models/Section');
const { Assignment } = require('../models/Assignment');
const { FileHierarchy } = require('../models/FileHierarchy');
const isValidObjectId = require('../utils/validateObjectId');

const fileController = {

	getFile: async (req, res) => {
		let file_id = req.params.file_id;

		if (!isValidObjectId(file_id))
			return res.status(400).send("Invalid ID");

		let file = await File.findById(file_id);

		if (!file)
			return res.status(404).send("The file with the given ID was not found");

		return res.status(200).json(file);
	},

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

	uploadFiles: async function (req, res) {

		// get uploaded files
		let sentFiles = [];
		sentFiles.push(req.files.files);
		sentFiles = sentFiles.flat(1); // flatten files to 1 array

		req.body.type = "file";
		sentFiles.forEach(sentFile => {
			this.addToHierarchy(req, res, sentFile);
		});

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

	addToHierarchy: async (req, res, sentFile) => {
		let {
			section_id,
			type,
			name,
		} = req.body;

		let parentPath = req.body.parentPath;


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
					const { mimetype, size, data: fileData } = sentFile;

					name = sentFile.name;
					path = `${parentPath}/${name}`;


					// if file already exists in directory
					let file = currHierarchy.children.find(child => child.path === path);

					if (file)
						return res.status(400).send("A file with the same name already exists.");

					file = new File({ section: section_id, name, type: mimetype, size, data: fileData });

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

	deleteFromHierarchy: async (req, res) => {
		let { section_id, path } = req.body;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("Section with the given ID was not found");

		path = cleanPath(path);
		if (!path || path === "root") {
			return res.status(400).send("path cannot be empty or root");
		}

		try {

			// find path and recursively delete its elements
			let originalHierarchy = section.fileHierarchy;


			let { resultingHierarchy, currentHierarchy, deleteHierarchy } = removeItemFromTree(originalHierarchy, path);

			section.fileHierarchy = resultingHierarchy;
			section.markModified('fileHierarchy');

			await section.save();

			const filesToDelete = [];
			recurseStructure(deleteHierarchy, filesToDelete);


			for (let i = 0; i < filesToDelete.length; i++) {
				let file = filesToDelete[i];

				if (file.type === "file")
					await File.findByIdAndDelete(file.data);
			}

			return res.status(201).json({ hierarchy: currentHierarchy, deletedFiles: filesToDelete });
		}
		catch (e) {
			return res.status(500).send(e.message);
		}
	}
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

function removeItemFromTree(currentHierarchy, pathToDelete) {
	let resultingHierarchy = currentHierarchy;
	while (currentHierarchy) {
		if (currentHierarchy.path !== pathToDelete) {
			let nextChildIndex = currentHierarchy.children.findIndex(child => pathToDelete.includes(child.path));

			if (currentHierarchy.children[nextChildIndex].path === pathToDelete) {
				// deleteHierarchy = currentHierarchy.children[nextChildIndex];
				deleteHierarchy = currentHierarchy.children.splice(nextChildIndex, 1)[0];
				currentHierarchy = currentHierarchy.children;
				break;
			}
			else {
				currentHierarchy = currentHierarchy.children[nextChildIndex];
			}
		}
	}
	return { resultingHierarchy, currentHierarchy, deleteHierarchy };
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