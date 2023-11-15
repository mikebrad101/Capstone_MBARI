const express = require("express");
const app = express();
const session = require('express-session');
const routes = require('./src/routes/routes');
app.set("view engine", "ejs");
const path = require('path'); 
app.use('/css', express.static(path.join(__dirname, 'src/views/css')));

app.set('trust proxy', 1)
app.use(session({
  secret: 'ch@r@ct3rs',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//will change dirname later when we move index.js file
app.set('views', path.join(__dirname+"/src", 'views'));

app.use('/', routes);

//added to use stylesheets+images
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(8080, () => {
  console.log("Expresss server running...")
});