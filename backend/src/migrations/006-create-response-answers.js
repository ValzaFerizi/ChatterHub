module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('response_answers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      response_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'responses',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      value_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      value_number: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      value_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      value_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('response_answers');
  }
};