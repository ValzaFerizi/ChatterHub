const ResponseRepository = {
  async createResponseWithAnswers(formId, respondentId, answers) {
    // TODO: create response and answers in database
  },

  async findResponsesByForm(formId) {
    // TODO: find all responses for a form
  },

  async findResponseById(responseId) {
    // TODO: find one response by id
  },

  async deleteResponse(responseId) {
    // TODO: delete response
  }
};

module.exports = ResponseRepository;
