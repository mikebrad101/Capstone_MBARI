const express = require('express');
const router = express.Router();
const { executeSQL,
  getChiefScientists,
  getPrincipalInvestigators } = require('../controllers/sql.js');
const app = express();
//need this to get data from webpage
router.use(express.urlencoded({ extended: true }));
const saltRounds = 10;
const bcrypt = require('bcrypt');
const path = require('path'); 
app.use('/css', express.static(path.join(__dirname, 'src/views/css')));


//middleware
function isAuthenticated(req, res, next) {
  console.log(req.session);
  //tired of logging in....
  //next();
  if (req.session.authenticated) {
    console.log("is authenticated");
    next();
  } else {
    console.log("not authenticated, redirecting....");
    res.redirect('/login');
  }
}

router.get("/", async function(req, res) {
  res.render('login');
});

router.get("/home", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('home');
});

router.get("/search", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('search');
});

router.get("/preexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  let scientists = await getChiefScientists();
  console.log(scientists);
  let investigators = await getPrincipalInvestigators();
  console.log(investigators);
  res.render('preexp', {"scientists": scientists, "investigators": investigators});
});

router.get("/login", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('login', { errorMessage: null });
});

router.get("/signup", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('signup', { errorMessage: null });
});

//what is this for?
router.get("/mbari-employee-dashboard", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('mbari-employee-dashboard');
});

router.get("/postexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('postexp');
});

//middlware to pass expedition_id to update Post
router.get("/updatePost/:exp_id", isAuthenticated, async function(req, res) {
  let sql = `SELECT * FROM expedition WHERE expedition_ID = ?`;
  let info = await executeSQL(sql, [req.params.exp_id]);

  res.render('postexp', { "info": info, "userID":req.session.userId});
});

//middlware to pass expedition_id to update
router.get("/update/:exp_id", isAuthenticated, async function(req, res) {
  let sql = `SELECT * FROM expedition WHERE expedition_ID = ?`;
  let expedition = await executeSQL(sql, [req.params.exp_id]);
  let scientists = getChiefScientists();
  let investigators = getPrincipalInvestigators();
  res.render('update', { "expedition": expedition, "scientists": scientists, "investigators": investigators});
});

router.get("/dive", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('dive');
});

router.get("/test", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('test');
});

router.get("/dbTest", async function(req, res) {
  // Create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  res.send(rows);
});

router.get("/allcruises", isAuthenticated, async function(req, res) {
  let sql = "SELECT * FROM expedition;";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  console.log("Results:", rows);
  res.render('allcruises', { "rows": rows});
});

router.get("/getLastEntry", isAuthenticated, async function(req, res) {
  let sql = 'SELECT * FROM expedition ORDER BY expedition_ID DESC LIMIT 1;';
  let rows = await executeSQL(sql);
  res.send(rows);
});

router.post("/addPrecruise", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    const {
      shipName,
      purpose,
      chiefScientist: chief_scientist,
      principalInvestigator: principal_investigator,
      scheduledStartDatetime: sch_start,
      scheduledEndDatetime: sch_end,
      equipmentDescription: equip_description,
      participants,
      regionDescription: region_description,
      plannedTrackDescription: planned_track_description
    } = req.body;

    //to keep track of what records are incomplete
    expedition_status = "Planned";

    const sql = 'INSERT INTO expedition (ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description, expedition_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const result = await executeSQL(sql, [
      shipName,
      purpose,
      chief_scientist,
      principal_investigator,
      sch_start,
      sch_end,
      equip_description,
      participants,
      region_description,
      planned_track_description, 
      expedition_status
    ]);

    console.log("Insert result:", result);

    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//postcruise update
router.post("/updatePost/:exp_id", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    const {
      actualStartDatetime: actual_start,
      actualEndDatetime: actual_end,
      accomplishments,
      scientistComments: scientist_comments,
      operatorComments: operator_comments,
      sciObjectivesMet: sci_objective_met,
      allEquipmentFunctioned: equipment_function,
      otherComments: other_comments,
      //can remove updated by once we have the user who is logged in
      updatedBy: updated_by
    } = req.body;

    //update post_cruise_complete to show that it is updated
    let sql = `UPDATE expedition
             SET expedition_status = "Complete",
             actual_start = ?,
             actual_end = ?,
             accomplishments = ?,
             scientist_comments = ?,
             operator_comments = ?,
             sci_objective_met = ?,
             equipment_function = ?,
             other_comments = ?,
             updated_by = ?
             WHERE expedition_ID = ?;`;

    const result = await executeSQL(sql, [
      actual_start, 
      actual_end, 
      accomplishments,
      scientist_comments,
      operator_comments,
      sci_objective_met,
      equipment_function,
      other_comments,
      updated_by,
      req.params.exp_id
    ]);

    console.log("Insert result:", result);

    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/updateExpedition", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);
    const {
      expedition_ID,
      ship_name,
      purpose,
      chief_scientist,
      principal_investigator,
      sch_start,
      sch_end,
      equip_description,
      participants,
      region_description,
      planned_track_description,
      expedition_status,
      actual_start,
      actual_end,
      accomplishments,
      scientist_comments,
      operator_comments,
      sci_objective_met,
      equipment_function,
      other_comments
    } = req.body;

    const sql = 'UPDATE expedition SET ship_name = ?, purpose = ?, chief_scientist = ?, principal_investigator = ?, sch_start = ?, sch_end = ?, equip_description = ?, participants = ?, region_description = ?, planned_track_description = ?, expedition_status = ?, actual_start = ?, actual_end = ?, accomplishments = ?, scientist_comments = ?, operator_comments = ?, sci_objective_met = ?, equipment_function = ?, other_comments = ? WHERE expedition_ID = ?';

    const result = await executeSQL(sql, [
      ship_name,
      purpose,
      chief_scientist,
      principal_investigator,
      sch_start,
      sch_end,
      equip_description,
      participants,
      region_description,
      planned_track_description,
      expedition_status,
      actual_start,
      actual_end,
      accomplishments,
      scientist_comments,
      operator_comments,
      //error with checkboxes
      sci_objective_met,
      equipment_function,
      other_comments,
      expedition_ID
    ]);

    console.log("Update result:", result);

    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/login', async (req, res) => {
  const { email, pwd } = req.body;

  let sql = 'SELECT user_ID, password, role FROM person WHERE email = ?';
  let results = await executeSQL(sql, [email]);
  console.log(results);
  if (results.length === 0) {
      // No user found with that email
      return res.render('login', { errorMessage: 'Invalid email or password.' });
  }
    const userId = results[0].user_ID
    const dbPassword = results[0].password;
    const dbRole = results[0].role;
    bcrypt.compare(pwd, dbPassword, (err, match) => {
      if (err) {
          console.error('Error verifying password: ' + err.message);
          return res.status(500).send('Internal Server Error');
      }
      if (!match) {
          return res.render('login', { errorMessage: 'Invalid email or password.' });
      }
      if (match) {
        console.log("successful login")
        
        req.session.authenticated = true;
        req.session.userId = userId;
        req.session.position = dbRole;
        console.log(req.session)
        req.session.save()
        res.redirect('/home');
      }
    });
});

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, role, occupation } = req.body;

  try {
    // First, hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into the 'person' table. Adjust this according to the actual structure of the 'person' table
    let sql = 'INSERT INTO person (email, password, first_name, last_name, role, occupation) VALUES (?, ?, ?, ?, ?, ?)';
    await executeSQL(sql, [email, hashedPassword, firstname, lastname, role, occupation]);

    res.status(201).redirect('/login');
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;


