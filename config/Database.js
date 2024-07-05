const Sequelize = require("sequelize");

const db = new Sequelize("plen6386_klinik", "plen386_ipan", "20102036ifan", {
  host: "https://klinik-asy-syifa-backend.vercel.app",
  dialect: "mysql",
});

const database = db;

module.exports = database;
