"use strict";

/** Déclaration modele comment **/
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("comments", {
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