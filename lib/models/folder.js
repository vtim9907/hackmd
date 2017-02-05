"use strict";

// external modules
var Sequelize = require("sequelize");

// core
var logger = require("../logger.js");

module.exports = function (sequelize, DataTypes) {
    var Folder = sequelize.define("Folder", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.TEXT
        },
        parentId: {
            type: DataTypes.UUID
        },
        ownerId: {
            type: DataTypes.UUID
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        classMethods: {
            associate: function(models) {
                Folder.belongsTo(models.User, {
                    foreignKey: "ownerId",
                    as: "owner",
                    constraints: false
                });
                Folder.hasMany(models.Note, {
                    foreignKey: "folderId",
                    as: "notes",
                    constraints: false
                });
                Folder.belongsTo(models.Folder, {
                    foreignKey: "parentId",
                    as: "parent",
                    constraints: false
                });
                Folder.hasMany(models.Folder, {
                    foreignKey: "parentId",
                    as: "folders",
                    constraints: false
                });
            }
        }
    });
    
    return Folder;
};
