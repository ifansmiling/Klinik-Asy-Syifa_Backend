const Sequelize = require("sequelize");

const db = new Sequelize("db_klinik", "root", "", {
  host: "",
  dialect: "mysql",
});

const database = db;

module.exports = database;
