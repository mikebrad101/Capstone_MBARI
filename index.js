var http = require('http');
const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = tempDB();

app.get("/", async function(req, res) {
  res.send("Howdy World");
});//dbTest

//executeSQL
async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}

const connection = mysql.createConnection({
  host: "t07cxyau6qg7o5nz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "mg6my0cujwumt4lr",
  password: "gnrv7rwzpmvpw19d",
  database: "tq38ylwyfie9f8a6"
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM Users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

function tempDB() {
  return mysql.createPool({
    connectionLimit: 10,
    host: "t07cxyau6qg7o5nz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "mg6my0cujwumt4lr",
    password: "gnrv7rwzpmvpw19d",
    database: "tq38ylwyfie9f8a6"
  });
}
app.get("/dbTest", async function(req, res) {
  //create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql);
  res.send(rows);
});//dbTest

app.listen(8080, () => {
  console.log("Expresss server running...")
});