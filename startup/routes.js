const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const loginsRouter = require('../routes/logins');
const coursesRouter = require('../routes/courses');
const sectionsRouter = require('../routes/sections');
const fileHierarchiesRouter = require('../routes/fileHierarchies');
const assignmentsRouter = require('../routes/assignments');
const submissionsRouter = require('../routes/submissions');
const instructorsRouter = require('../routes/instructors');
const studentsRouter = require('../routes/students');

module.exports = function (app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(fileUpload());
	app.use(cors({
		origin: ["http://127.0.0.1:5501", "http://localhost:4200/", "*"],
		optionsSuccessStatus: 200,
		credentials: true,
		allowedHeaders: ["Content-Type"]
	}));

	app.get('/', (req, res) => {
		res.status(200).send("home");
	});

	app.use('/api/logins', loginsRouter);
	app.use('/api/courses', coursesRouter);
	app.use('/api/sections', sectionsRouter);
	app.use('/api/hierarchies', fileHierarchiesRouter);
	app.use('/api/assignments', assignmentsRouter);
	app.use('/api/submissions', submissionsRouter);
	app.use('/api/instructors', instructorsRouter);
	app.use('/api/students', studentsRouter);
	app.use('*', (req, res) => res.redirect('/'));

}
