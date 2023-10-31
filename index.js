const express = require("express");
const app = express();
const session = require('express-session');
const routes = require('./src/routes/routes');
app.set("view engine", "ejs");
const path = require('path'); 

app.use(session({
  secret: 'ch@r@ct3rs',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//will change dirname later when we move index.js file
app.set('views', path.join(__dirname+"/src", 'views'));

app.use('/', routes);

app.listen(8080, () => {
  console.log("Expresss server running...")
});