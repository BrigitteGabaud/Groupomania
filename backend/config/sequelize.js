const { Sequelize } = require('sequelize')

const sequelize = new Sequelize
('groupomania',
 'root',
  '',
   {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })

  sequelize.authenticate()
  .then(_ => console.log('La connexion à la base de données à bien été établie !.'))
  .catch(error => console.error(`Impossible d'établie la connexion avec la base de données.${error}`))