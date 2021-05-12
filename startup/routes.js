const express = require('express');
const cookieParser = require('cookie-parser');

const coursesRouter = require('../routes/courses');
const sectionsRouter = require('../routes/sections');
const assignmentsRouter = require('../routes/assignments');
const submissionsRouter = require('../routes/submissions');
const instructorsRouter = require('../routes/instructors');
const studentsRouter = require('../routes/students');

module.exports = function (app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());


	app.get('/', (req, res) => {
		res.status(200).send("home");
	});

	app.use('/api/courses', coursesRouter);
	app.use('/api/sections', sectionsRouter);
	app.use('/api/assignments', assignmentsRouter);
	app.use('/api/submissions', submissionsRouter);
	app.use('/api/instructors', instructorsRouter);
	app.use('/api/students', studentsRouter);
	app.use('*', (req, res) => res.redirect('/'));
}
