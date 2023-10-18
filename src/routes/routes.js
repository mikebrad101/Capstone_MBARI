const express = require('express');
const router = express.Router();
const { executeSQL } = require('../controllers/sql.js');
const app = express();
//need this to get data from webpage
router.use(express.urlencoded({ extended: true }));

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

router.get("/dbTest", async function(req, res) {
  // Create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  res.send(rows);
});

router.get("/dive", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('dive');
});

router.get("/testSQL", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('testSQL');
});

router.get("/getLastEntry", async function(req, res) {
  let sql = 'SELECT * FROM expedition ORDER BY expedition_ID DESC LIMIT 1;';
  let rows = await executeSQL(sql);
  res.send(rows);
});

router.post("/testSQLinsert", async function(req, res) {
  let sql = 'INSERT INTO expedition (ship_name, purpose,chief_scientist,principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description, actual_start, actual_end, accomplishments, scientist_comments, operator_comments, sci_objective_met, equipment_function, other_comments, updated_by ) VALUES(\'TESTT I\', \'TEST Research\', \'Dr. TEST Johnson\', \'Prof. TEST Davis\', \'2023-01-10 08:00:00\', \'2023-01-20 16:00:00\', \'ROV, TEST\', \'Team of TESTS\', \'North TEST\', \'Exploration of underwater TESTS\', \'2023-01-12 08:30:00\', \'2023-01-19 15:45:00\', \'Discovered new TEST of marine life\', \'Impressive TEST formations\', \'Minor TEST issues\', TRUE, TRUE, \'Great TESTS\', \'001\');'
  await executeSQL(sql);
  res.redirect('/getLastEntry');
});

router.post("/addPrecruise", async function(req, res) {
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

    const sql = 'INSERT INTO expedition (ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

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
      planned_track_description
    ]);

    console.log("Insert result:", result);

    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;