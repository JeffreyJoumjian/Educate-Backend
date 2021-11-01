const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');

const { Instructor } = require('../models/Instructor');
const { Student } = require('../models/Student');
const cookieParser = require('cookie-parser');

function generateLoginToken(user) {
	let userType;

	if (user instanceof Instructor)
		userType = "instructor";
	else if (user instanceof Student)
		userType = "student";
	else
		throw Error("Invalid user type");

	const token = jwt.sign({
		_id: user._id,
		fullName: user.fullName,
		userType
	},
		process.env.EDUCATE_PRIVATE_KEY,
		{ expiresIn: '1h' }
	);
	return { token, user_id: user._id, userType, expiresIn: 3600 };
}

router.post('/', async (req, res) => {
	const { email, password } = req.body;

	let user = await Instructor.findOne({ email }) || await Student.findOne({ email });

	if (!user)
		return res.status(404).send("The user with the given email was not found");

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword)
		return res.status(400).send("Invalid password");

	try {
		const token = generateLoginToken(user);

		return res.cookie('educate_login_token', token.token, {
			httpOnly: true,
			sameSite: 'none',
			domain: 'localhost',
			secure: true
		}).json(token);
	}
	catch (e) {
		return res.status(500).send(e.message);
	}
});

// router.get('/', async (req, res) => {
// 	console.log(req.cookies.educate_login_token);
// 	return res.send();
// })


module.exports = router;