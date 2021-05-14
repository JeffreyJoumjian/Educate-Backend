const jwt = require('jsonwebtoken');
const { Instructor } = require('../models/Instructor');
const { Student } = require('../models/Student');

module.exports = async function (req, res, next) {
	const token = req.header('x-login-token') ? req.header('x-login-token') : req.cookies.educate_login_token;

	if (!token)
		return res.status(401).send('Access denied. No token provided');

	try {
		const decoded = jwt.verify(token, process.env.EDUCATE_PRIVATE_KEY);

		req.user = decoded.userType === "instructor" ?
			await Instructor.findById(decoded._id) :
			await Student.findById(decoded._id);
		next();
	}
	catch (e) {
		return res.status(403).send("Invalid token");
	}

}