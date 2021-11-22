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
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
  };