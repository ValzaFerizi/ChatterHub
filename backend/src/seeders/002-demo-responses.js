const demoResponsesSeeder = {
  async run() {
    // TODO: Insert demo response data into the database

    const demoResponses = [
      {
        respondent: 'Anonymous',
        answers: [
          {
            questionLabel: 'Full Name',
            value: 'Test User'
          },
          {
            questionLabel: 'Email',
            value: 'test@example.com'
          },
          {
            questionLabel: 'Which workshop do you want to attend?',
            value: 'Backend'
          },
          {
            questionLabel: 'Dietary preferences',
            value: ['Halal']
          }
        ]
      }
    ];

    return demoResponses;
  }
};

module.exports = demoResponsesSeeder;