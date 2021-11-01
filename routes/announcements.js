const router = require('express').Router();
const announcementController = require('../controllers/announcementController');

router.get('/section/:section_id', (req, res) => announcementController.getAnnoucementsBySectionId(req, res));
router.get('/student/:student_id', (req, res) => announcementController.getAllAnnouncementsByStudentId(req, res));
router.get('/instructor/:instructor_id', (req, res) => announcementController.getAllAnnouncementsByInstructorId(req, res));

router.post('/', (req, res) => announcementController.createAnnouncement(req, res));

module.exports = router;