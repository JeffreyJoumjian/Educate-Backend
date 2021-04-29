const path = require('path');
const { createLogger, transports, format, configure } = require('winston');
const { combine, timestamp, colorize, json, simple } = format;
require('express-async-errors');

module.exports = function () {

	configure({
		transports: [
			new transports.Console({ format: combine(colorize(), simple()) }),
			new transports.File({
				filename: path.join('logs/logfile.log'),
				level: 'info',
				format: combine(timestamp(), colorize())
			}),
		],
		exceptionHandlers: [
			new transports.File({
				filename: path.join('logs/uncaughtExceptions.log'),
				format: combine(timestamp(), colorize(), json())
			})
		],
		rejectionHandlers: [
			new transports.File({
				filename: path.join('logs/uncaughtRejections.log'),
				format: combine(timestamp(), colorize(), json())
			})
		]
	});
}
// module.exports = logger;
