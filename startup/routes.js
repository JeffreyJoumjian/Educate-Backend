const express = require('express');
const cookieParser = require('cookie-parser');

const courses = require('../routes/courses');
const instructors = require('../routes/instructors');

module.exports = function (app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());


	app.get('/', (req, res) => {
		res.status(200).send("home");
	});

	app.use('/courses', courses);
	app.use('/instructors', instructors);
	app.use('*', (req, res) => res.redirect('/'));
}
