const express = require('express');
const router = express.Router();
const { executeSQL } = require('../controllers/sql.js');

router.get("/", async function(req, res) {
  res.send("Howdy World");
});

router.get("/dbTest", async function(req, res) {
  // Create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  res.send(rows);
});

module.exports = router;