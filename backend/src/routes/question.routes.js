const express = require('express');
const QuestionController = require('../controllers/question.controller');

const router = express.Router();

router.post('/forms/:formId/questions', QuestionController.createQuestion);
router.get('/forms/:formId/questions', QuestionController.getQuestionsByForm);
router.put('/:questionId', QuestionController.updateQuestion);
router.delete('/questions/:questionId', QuestionController.deleteQuestion);
router.patch('/forms/:formId/questions/reorder', QuestionController.reorderQuestions);

module.exports = router;
