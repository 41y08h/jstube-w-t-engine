const { Pool } = require("pg");

const db = new Pool({
  database: "jstube",
  user: "postgres",
  password: "pass",
});

module.exports = db;
