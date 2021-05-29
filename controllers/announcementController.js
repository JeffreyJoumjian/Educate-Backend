const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Announcement } = require('../models/Announcement');
const { Section } = require('../models/Section');
const { Student } = require('../models/Student');
const { Instructor } = require('../models/Instructor');

const announcementController = {
	getAnnoucementsBySectionId: async (req, res) => {
		let section_id = req.params.section_id;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let announcements = await Announcement
			.find({ section: section_id })
			.populate('section')
			.populate('section.course');

		return res.status(200).json(announcements);
	},

	getAllAnnouncementsByStudentId: async (req, res) => {
		let student_id = req.params.student_id;

		if (!isValidObjectId(student_id))
			return res.status(400).send("Invalid ID");

		let student = await Student.findById(student_id);

		if (!student)
			return res.status(404).send("The student with the given ID was not found");

		let announcements = [];

		for (let i = 0; i < student.studentSections.length; i++) {
			let announcement = await Announcement
				.find({ section: student.studentSections[i] })
				.populate({
					path: 'section',
					select: 'course',
					populate: {
						path: 'course',
						select: 'name'
					}
				});

			if (announcement.length > 0)
				announcements.push(...announcement);

		}

		return res.status(200).json(announcements);

	},
	getAllAnnouncementsByInstructorId: async (req, res) => {
		let instructor_id = req.params.instructor_id;

		if (!isValidObjectId(instructor_id))
			return res.status(400).send("Invalid ID");

		let instructor = await Instructor.findById(instructor_id);

		if (!instructor)
			return res.status(404).send("The instructor with the given ID was not found");

		let announcements = [];

		for (let i = 0; i < instructor.teachingSections.length; i++) {
			let announcement = await Announcement
				.find({ section: instructor.teachingSections[i] })
				.populate({
					path: 'section',
					select: 'course',
					populate: {
						path: 'course',
						select: 'name'
					}
				});

			if (announcement.length > 0)
				announcements.push(...announcement);
		}

		return res.status(200).json(announcements);
	},

	createAnnouncement: async (req, res) => {
		let { section_id, title, description } = req.body;

		if (!isValidObjectId(section_id))
			return res.status(400).send("Invalid ID");

		let section = await Section.findById(section_id);

		if (!section)
			return res.status(404).send("The section with the given ID was not found.");

		let announcement = new Announcement({ section: section_id, title, description });

		announcement = await announcement.save();

		return res.status(201).json(announcement);
	}
}

module.exports = announcementController;