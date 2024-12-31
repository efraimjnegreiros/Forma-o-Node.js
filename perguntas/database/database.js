const Sequelize = require("sequelize");

const connection = new Sequelize('guiaPerguntas', 'root','11042008', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;