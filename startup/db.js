const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {

	const { DEV_MODE, DB_USER, DB_PASSWORD, DB_NAME, DB_AUTH, DB_W } = process.env;

	const db = DEV_MODE === "online" ?
		`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.36vbt.mongodb.net/${DB_NAME}?${DB_AUTH}&${DB_W}`
		: "mongodb://127.0.0.1:27017/Educate";

	mongoose.connect((db), {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true
	}).then(() => winston.info(`Connected to MongoDb - Educate(${DB_NAME})`)).catch(e => console.log(e.stack));
}