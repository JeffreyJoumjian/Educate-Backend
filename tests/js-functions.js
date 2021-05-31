// TESTING DATES

function testDate() {

	const { parse, parseISO, format, isAfter, isBefore } = require('date-fns');

	let startDate = parse(`13/05/2021 12:01 AM`, 'dd/MM/yyyy p', Date.now());
	let endDate = parse(`30/05/2021 11:59 PM`, 'dd/MM/yyyy p', Date.now());
	// let currentDate = parse(Date.now(), "dd/MM/yyyy p", Date.now());

	// let currFull = parse(`${}`);
	let currentDate = format(Date.now(), 'dd/MM/yyyy p').split(" ");
	let currTime = currentDate[1].split(":");

	currTime[0] = currTime[0].length === 1 ? "0" + currTime[0] : currTime[0];

	currTime = currTime.join(":");
	currentDate[1] = currTime;
	currentDate = currentDate.join(" ");

	if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate))
		return true;

	return false;
}

console.log(testDate());

function testFileHierachy(path) {
	let section = {
		path: "/",
		children: [
			{
				path: "folder1",
				children: [
					{
						path: "folder1/folder1_child1",
						children: []
					},
					{
						path: "folder1/folder1_child2",
						children: []
					},
					{
						path: "folder1/folder1_child3",
						children: [
							{
								path: "folder1/folder1_child3/assignment1"
							},
							{
								path: "folder1/folder1_child3/folder1_child3_child2"
							}
						]
					}
				]
			},
			{
				path: "folder2",
				children: [
					{
						path: "folder2/june.png"
					}
				]
			}
		]
	}

	let fileHierarchy = section;

	if (path === "/")
		return fileHierarchy;

	// while there are children fileHierarchies
	while (fileHierarchy) {
		if (path === fileHierarchy.path)
			return fileHierarchy;

		// check if path is a subtring of one of the child paths
		fileHierarchy = fileHierarchy.children.find(child => {
			return path.toLowerCase().includes(child.path);
		});

	}

	if (!fileHierarchy)
		return "path not found";
}

function addToHierarchy(parentPath) {

	let fileHierachy = {
		path: "/",
		children: [
			{
				path: "seasons",
				children: [
					{
						path: "seasons/winter",
						children: []
					},
					{
						path: "seasons/summer",
						children: []
					}
				]
			}
		]
	};

	let file = {
		name: "summer.jpg",
		size: 122432,
		type: "img/jpeg",
		data: "test data"
	};

	let currHierarchy = fileHierachy;
	while (currHierarchy) {
		if (parentPath === currHierarchy.path) {
			currHierarchy.children.push({
				path: `${parentPath}/${file.name}`,
				children: []
			});
			return JSON.stringify(fileHierachy, null, ' ');
		}

		currHierarchy = currHierarchy.children.find(child => parentPath.includes(child.path));
	}

	if (!currHierarchy)
		return "path not found";
}


let paths = {
	"path": "",
	"name": "photos",
	"type": "directory",
	"children": [
		{
			"path": "summer",
			"name": "summer",
			"type": "directory",
			"children": [
				{
					"path": "summer/june",
					"name": "june",
					"type": "directory",
					"children": [
						{
							"path": "summer/june/windsurf.jpg",
							"name": "windsurf.jpg",
							"type": "file"
						}
					]
				}
			]
		},
		{
			"path": "winter",
			"name": "winter",
			"type": "directory",
			"children": [
				{
					"path": "winter/january",
					"name": "january",
					"type": "directory",
					"children": [
						{
							"path": "winter/january/ski.png",
							"name": "ski.png",
							"type": "file"
						},
						{
							"path": "winter/january/snowboard.jpg",
							"name": "snowboard.jpg",
							"type": "file"
						}
					]
				}
			]
		}
	]
}

let filesToDelete = [];
function recurseStructure(path, arr) {

	if (!path.children) {
		let obj = {
			name: path.name,
			type: path.type
		}
		arr.push(obj);
		return;
	}

	if (path.children)
		path.children.forEach(child => recurseStructure(child, filesToDelete));

}
