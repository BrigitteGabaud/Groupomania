"use strict";

/** Déclaration modele comment **/
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("comments", {
      id: {
      type: DataTypes.INTEGER, 
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
      },
      postId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: "posts",
            key: "id"
        }
    }
    }, {
      timestamps: true
    });
  };