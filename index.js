const express = require("express");
const app = express();
const routes = require('./src/routes/routes');
app.set("view engine", "ejs");
const path = require('path'); 

app.set('views', path.join(__dirname+"/src", 'views'));

app.use('/', routes);

app.listen(8080, () => {
  console.log("Expresss server running...")
});