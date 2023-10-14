const express = require("express");
const app = express();
const routes = require('./src/routes/routes');
app.set("view engine", "ejs");
const path = require('path'); 

//will change dirname later when we move index.js file
app.set('views', path.join(__dirname+"/src", 'views'));

app.use('/', routes);

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  // Here you should authenticate the user. 
  // If the user is authenticated, you'd typically get their role from the database.
  // For the sake of simplicity, let's assume they're authenticated and we'll use the role from the form:

  switch(role) {
      case '1':
          res.redirect('/mbari-employee-dashboard');
          break;
      case '2':
          res.redirect('/registered-user-dashboard');
          break;
      case '3':
          res.redirect('/logistics-coordinator-dashboard');
          break;
      case '4':
          res.redirect('/employee-coordinator-dashboard');
          break;
      case '5':
          res.redirect('/registered-logistics-dashboard');
          break;
      case '6':
          res.redirect('/employee-registered-dashboard');
          break;
      default:
          res.redirect('/login');
          break;
  }
});

app.get('/admin-dashboard', (req, res) => {
  res.render('adminDashboard');
});

app.get('/captain-dashboard', (req, res) => {
  res.render('captainDashboard');
});

app.get('/diver-dashboard', (req, res) => {
  res.render('diverDashboard');
});

app.listen(8080, () => {
  console.log("Expresss server running...")
});