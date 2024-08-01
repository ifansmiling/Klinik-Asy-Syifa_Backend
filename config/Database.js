const Sequelize = require("sequelize");

const db = new Sequelize("klinik_asysyifa", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const database = db;

module.exports = database;
