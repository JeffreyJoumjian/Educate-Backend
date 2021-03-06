// const config = require('config');
const env = require('dotenv').config();

module.exports = function () {

	if (env.error)
		throw new Error('FATAL ERROR: COULD NOT SET UP ENV');

	if (!process.env.EDUCATE_PRIVATE_KEY)
		throw new Error('FATAL ERROR: EDUCATEPRIVATEKEY IS NOT DEFINED');
}