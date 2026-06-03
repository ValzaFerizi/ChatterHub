const demoFormSeeder = {
  async run() {
    // TODO: Insert demo form data into the database

    const demoForm = {
      title: 'Event Registration',
      description: 'Demo form used for testing the form builder.',
      sections: [
        {
          title: 'Personal Information',
          questions: [
            {
              label: 'Full Name',
              type: 'short_answer',
              isRequired: true
            },
            {
              label: 'Email',
              type: 'short_answer',
              isRequired: true
            },
            {
              label: 'Which workshop do you want to attend?',
              type: 'dropdown',
              isRequired: true,
              options: ['Frontend', 'Backend', 'DevOps']
            },
            {
              label: 'Dietary preferences',
              type: 'checkboxes',
              isRequired: false,
              options: ['Vegan', 'Vegetarian', 'Halal', 'None']
            }
          ]
        }
      ]
    };

    return demoForm;
  }
};

module.exports = demoFormSeeder;