const express = require('express');
const router = express.Router();
const { executeSQL } = require('../controllers/sql.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

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

module.exports = router;

module.exports = router;