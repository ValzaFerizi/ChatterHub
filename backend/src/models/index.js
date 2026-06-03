const sequelize = require('../config/sequelize');

const Form = require('./Form');
const Section = require('./Section');
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');
const Response = require('./Response');
const ResponseAnswer = require('./ResponseAnswer');

Form.hasMany(Section, {
  foreignKey: 'formId',
  as: 'sections',
  onDelete: 'CASCADE'
});

Section.belongsTo(Form, {
  foreignKey: 'formId',
  as: 'form'
});

Form.hasMany(Question, {
  foreignKey: 'formId',
  as: 'questions',
  onDelete: 'CASCADE'
});

Question.belongsTo(Form, {
  foreignKey: 'formId',
  as: 'form'
});

Section.hasMany(Question, {
  foreignKey: 'sectionId',
  as: 'questions',
  onDelete: 'SET NULL'
});

Question.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

Question.hasMany(QuestionOption, {
  foreignKey: 'questionId',
  as: 'options',
  onDelete: 'CASCADE'
});

QuestionOption.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

Form.hasMany(Response, {
  foreignKey: 'formId',
  as: 'responses',
  onDelete: 'CASCADE'
});

Response.belongsTo(Form, {
  foreignKey: 'formId',
  as: 'form'
});

Response.hasMany(ResponseAnswer, {
  foreignKey: 'responseId',
  as: 'answers',
  onDelete: 'CASCADE'
});

ResponseAnswer.belongsTo(Response, {
  foreignKey: 'responseId',
  as: 'response'
});

Question.hasMany(ResponseAnswer, {
  foreignKey: 'questionId',
  as: 'responseAnswers',
  onDelete: 'CASCADE'
});

ResponseAnswer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

module.exports = {
  sequelize,
  Form,
  Section,
  Question,
  QuestionOption,
  Response,
  ResponseAnswer
};