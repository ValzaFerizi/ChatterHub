const sequelize = require('../config/sequelize');

const User           = require('./User');
const Role           = require('./Role');
const UserRole       = require('./UserRole');
const Permission     = require('./Permission');
const RolePermission = require('./RolePermission');
const RefreshToken   = require('./RefreshToken');
const Notification   = require('./Notification');
const Settings       = require('./Settings');
const Files          = require('./Files');

const PasswordResetToken = require('./PasswordResetToken');
const LoginAttempt       = require('./LoginAttempt');
const UserSession        = require('./UserSession');

const Form           = require('./Form');
const Section        = require('./Section');
const Question       = require('./Question');
const QuestionOption = require('./QuestionOption');
const Response       = require('./Response');
const ResponseAnswer = require('./ResponseAnswer');

User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', as: 'users' });
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Files, { foreignKey: 'uploaded_by', as: 'files' });
Files.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

Form.hasMany(Section, { foreignKey: 'formId', as: 'sections', onDelete: 'CASCADE' });
Section.belongsTo(Form, { foreignKey: 'formId', as: 'form' });
Form.hasMany(Question, { foreignKey: 'formId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Form, { foreignKey: 'formId', as: 'form' });
Section.hasMany(Question, { foreignKey: 'sectionId', as: 'questions', onDelete: 'SET NULL' });
Question.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Question.hasMany(QuestionOption, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE' });
QuestionOption.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
Form.hasMany(Response, { foreignKey: 'formId', as: 'responses', onDelete: 'CASCADE' });
Response.belongsTo(Form, { foreignKey: 'formId', as: 'form' });
Response.hasMany(ResponseAnswer, { foreignKey: 'responseId', as: 'answers', onDelete: 'CASCADE' });
ResponseAnswer.belongsTo(Response, { foreignKey: 'responseId', as: 'response' });
Question.hasMany(ResponseAnswer, { foreignKey: 'questionId', as: 'responseAnswers', onDelete: 'CASCADE' });
ResponseAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
User.hasMany(Form, { foreignKey: 'ownerId', as: 'forms' });
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'passwordResetTokens', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(UserSession, { foreignKey: 'user_id', as: 'userSessions', onDelete: 'CASCADE' });
UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Form.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = {
  sequelize,
  User, Role, UserRole, Permission, RolePermission,
  RefreshToken, Notification, Settings, Files,
  Form, Section, Question, QuestionOption,
  Response, ResponseAnswer,
  PasswordResetToken, LoginAttempt, UserSession
};