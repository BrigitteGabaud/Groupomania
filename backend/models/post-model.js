/** Déclaration modele post **/

const { Sequelize } = require(".")

module.exports = (sequelize, DataTypes) => {
    
    /* Méthode 'define + 3 params:
        1. 'users' = nom modele --> sequelize créera table 'users'
        2. ligne7 à ligne25 = propriétés du modèle --> colonnes de la table */
    return sequelize.define('posts', {
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }, 
       /*  date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        } */
    }, {
    /* 3. option de paramétrage global */
        timestamps: true, 
        createdAT: true, // date création
        updateAt: true   // date modification
    })
}