var http = require('http');
const express = require("express");
//const mysql = require('mysql');
const app = express();
const routes = require('./src/config/routes');

app.use('/', routes);

app.listen(8080, () => {
  console.log("Expresss server running...")
});