const express = require('express');
const FormController = require('../controllers/form.controller');

const router = express.Router();

router.post('/', FormController.createForm);
router.get('/', FormController.getForms);
router.get('/:formId', FormController.getFormById);
router.put('/:formId', FormController.updateForm);
router.delete('/:formId', FormController.deleteForm);
router.patch('/:formId/publish', FormController.publishForm);
router.patch('/:formId/unpublish', FormController.unpublishForm);
module.exports = router;
