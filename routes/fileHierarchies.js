const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({});

const fileController = require('../controllers/fileController');

router.get('/', (req, res) => res.status(200).send("fileHierachies"));

router.get('/file/:file_id', (req, res) => fileController.getFile(req, res));

router.get('/:section_id', (req, res) => fileController.getFileHierarchy(req, res));

router.post('/', (req, res) => fileController.addToHierarchy(req, res));

router.post('/upload', (req, res) => fileController.uploadFiles(req, res));

router.delete('/', (req, res) => fileController.deleteFromHierarchy(req, res));



module.exports = router;