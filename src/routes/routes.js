const express = require('express');
const router = express.Router();
const { executeSQL } = require('../controllers/sql.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(express.static('client/public'));


router.get("/", async function(req, res) {
  res.render('home');
});

router.get("/preexp", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('preexp');
});

router.get("/login", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('login');
});

router.get("/postexp", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('postexp');
});

router.get("/dive", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('dive');
});
router.get("/signup", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('signup');
});

router.get("/mbari-employee-dashboard", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('mbari-employee-dashboard');
});
// Registered User Dashboard
router.get('/registered-user-dashboard', (req, res) => {
  res.render('registered-user-dashboard');
});

// Logistics Coordinator Dashboard
router.get('/logistics-coordinator-dashboard', (req, res) => {
  res.render('logistics-coordinator-dashboard');
});
router.get("/dbTest", async function(req, res) {
  // Create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  res.send(rows);
});

// create route.get() to confirm user exist in database to compare the encrypt password 

router.post('/addPrecruise', async (req, res) => {
  let ship_name = req.body.shipName;
  let purpose = req.body.purpose;
  let chief_scientist = req.body.chiefScientist;
  let principal_investigator = req.body.principalInvestigator;
  let sch_start = req.body.scheduledStartDatetime;
  let sch_end = req.body.scheduledEndDatetime;
  let equipmentDescription = req.body.scheduledStartDatetime;
  let participants = req.body.participants;
  let region_description = req.body.regionDescription;
  let planned_track_description = req.body.plannedTrackDescription;
  //const { ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equipmentDescription, participants, region_description, planned_track_description } = req.body;
  // Insert the new post into the database
  let sql = 'INSERT INTO expedition (ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await executeSQL(sql, [ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equipmentDescription, participants, region_description, planned_track_description], (err, result) => {
    if (err) {
      console.error('Error inserting expedition: ' + err.message);
      res.status(500).send('Error inserting expedition');
      return;
    }
    res.status(201).json({ message: 'Expedition created successfully' });
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Make sure you're selecting the password and role columns if they exist in your DB
  let sql = 'SELECT password, role FROM Users WHERE FirstName = ?';

  await executeSQL(sql, [username], async (err, results) => {
    if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).send('Internal Server Error');
        return;
    }

    if (results.length === 0) {
        // No user found with that username
        return res.redirect('/login');
    }

    const dbPassword = results[0].password;
    const dbRole = results[0].role;

        // Compare provided password with hashed password in database
        bcrypt.compare(password, dbPassword, (err, match) => {
          if (err) {
              console.error('Error verifying password: ' + err.message);
              return res.status(500).send('Internal Server Error');
          }

          if (!match) {
              // Wrong password
              return res.redirect('/login');
          }

          // Password is correct, redirect based on role
          switch (dbRole) {
              case 'mbari-employee':
                  res.redirect('/mbari-employee-dashboard');
                  break;
              case 'registered-user':
                  res.redirect('/registered-user-dashboard');
                  break;
              case 'logistics-coordinator':
                  res.redirect('/logistics-coordinator-dashboard');
                  break;
              default:
                  // Unknown role or user not assigned a role
                  res.redirect('/login');
                  break;
          }
      });
  });
});

router.post('/signup', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  let email = req.body.email;
  let role = req.body.role; 

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let sql = 'INSERT INTO Users (username, password, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, ?)';
    await executeSQL(sql, [username, hashedPassword, firstName, lastName, email, role], (err, result) => {
      if (err) {
        console.error('Error registering user: ' + err.message);
        res.status(500).send('Error registering user');
        return;
      }
      res.status(201).redirect('/login');
    });
  });
});







module.exports = router;

module.exports = router;