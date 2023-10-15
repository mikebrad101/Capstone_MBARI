const express = require("express");
const app = express();
const routes = require('./src/routes/routes');
app.set("view engine", "ejs");
const path = require('path'); 
const bcrypt = require("bcrypt");

//will change dirname later when we move index.js file
app.set('views', path.join(__dirname+"/src", 'views'));

app.use('/', routes);

// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   connection.query('SELECT password, role FROM Users WHERE username = ?', [username], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     if (results.length === 0) {
//       // No user found with that username
//       return res.redirect('/login');
//     }

//     const dbPassword = results[0].password;
//     const dbRole = results[0].role;

//     // Compare provided password with hashed password in database
//     bcrypt.compare(password, dbPassword, (err, result) => {
//       if (err) {
//         console.error('Error verifying password:', err);
//         return res.status(500).send('Internal Server Error');
//       }

//       if (!result) {
//         // Wrong password
//         return res.redirect('/login');
//       }

//       // Password is correct, redirect based on role
//       switch (dbRole) {
//         case 1:
//           res.redirect('/mbari-employee-dashboard');
//           break;
//         case 2:
//           res.redirect('/registered-user-dashboard');
//           break;
//         case 3:
//           res.redirect('/logistics-coordinator-dashboard');
//           break;
//         case 4:
//           res.redirect('/employee-coordinator-dashboard');
//           break;
//         case 5:
//           res.redirect('/registered-logistics-dashboard');
//           break;
//         case 6:
//           res.redirect('/employee-registered-dashboard');
//           break;
//         default:
//           res.redirect('/login');
//           break;
//       }
//     });
//   });
// });

// app.post('/register', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   bcrypt.hash(password, 10, (err, hashedPassword) => { // "10" is the saltRounds. Can adjust based on your needs.
//     if (err) {
//       console.error('Error hashing password:', err);
//       return res.status(500).send('Internal Server Error');
//     }

//     connection.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
//       if (err) {
//         console.error('Database insertion error:', err);
//         return res.status(500).send('Internal Server Error');
//       }

//       res.redirect('/login');
//     });
//   });
// });

// app.get('/admin-dashboard', (req, res) => {
//   res.render('adminDashboard');
// });

// app.get('/captain-dashboard', (req, res) => {
//   res.render('captainDashboard');
// });

// app.get('/diver-dashboard', (req, res) => {
//   res.render('diverDashboard');
// });

app.listen(8080, () => {
  console.log("Expresss server running...")
});