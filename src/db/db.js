const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "shashank@123",
//   database: "income_tax_generator",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: "mainline.proxy.rlwy.net",
  port: 40511,
  user: "root",
  password: "hoDsbVogasnbVRUiOZxoWQSAhFFBRblZ",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
