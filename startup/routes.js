const express = require('express');
const cookieParser = require('cookie-parser');

const courses = require('../routes/courses');

module.exports = function (app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());


	app.get('/', (req, res) => {
		res.status(200).send("home");
	});

	app.use('/courses', courses);
	app.use('*', (req, res) => res.redirect('/'));
}
