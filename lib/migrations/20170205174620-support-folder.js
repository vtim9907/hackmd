'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Notes', 'folderId', Sequelize.UUID);
    queryInterface.createTable('Folders', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      name: Sequelize.TEXT,
      parentId: Sequelize.UUID,
      ownerId: Sequelize.UUID,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    return;
  },
  
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Folders');
    queryInterface.removeColumn('Notes', 'folderId');
    return;
  }
};
