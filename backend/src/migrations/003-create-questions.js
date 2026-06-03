module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      form_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forms',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sections',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      label: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(
          'short_answer',
          'paragraph',
          'multiple_choice',
          'checkboxes',
          'dropdown',
          'file_upload',
          'linear_scale',
          'multiple_choice_grid',
          'checkbox_grid',
          'date',
          'time'
        ),
        allowNull: false
      },
      placeholder: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      help_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      validation_rules: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  }
};