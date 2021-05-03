const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
	const db = "mongodb://127.0.0.1:27017/Educate";

	// const db = `${config.get('db.host')}&authSource=${config.get('db.auth')}&w=${config.get('db.w')}`
	// const db = `${process.env.DB_HOST}&authSource=${process.env.DB_AUTH}&w=${process.env.DB_W}`

	mongoose.connect((db), {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true
	}).then(() => winston.info(`Connected to MongoDb - Educate`));
}