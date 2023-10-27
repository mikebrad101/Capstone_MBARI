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

//middlware to pass expedition_id to update Post
router.get("/updatePost/:exp_id", async function(req, res) {
  let sql = `SELECT * FROM expedition WHERE expedition_ID = ?`;
  let info = await executeSQL(sql, [req.params.exp_id]);
  
  res.render('postexp', { "info": info});
});

//middlware to pass expedition_id to update
router.get("/update/:exp_id", async function(req, res) {
  let sql = `SELECT * FROM expedition WHERE expedition_ID = ?`;
  let expedition = await executeSQL(sql, [req.params.exp_id]);
  
  res.render('update', { "expedition": expedition});
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

router.get("/allcruises", async function(req, res) {
  let sql = "SELECT * FROM expedition;";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  console.log("Results:", rows);
  res.render('allcruises', { "rows": rows});
});

router.get("/getLastEntry", async function(req, res) {
  let sql = 'SELECT * FROM expedition ORDER BY expedition_ID DESC LIMIT 1;';
  let rows = await executeSQL(sql);
  res.send(rows);
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

    //to keep track of what records are incomplete
    post_cruise_complete = 0;

    const sql = 'INSERT INTO expedition (ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description, post_cruise_complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

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
      post_cruise_complete
    ]);

    console.log("Insert result:", result);

    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//postcruise update
router.post("/updatePost/:exp_id", async function(req, res) {
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
             SET post_cruise_complete = 1,
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


router.post("/updateExpedition", async function(req, res) {
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
      post_cruise_complete,
      actual_start,
      actual_end,
      accomplishments,
      scientist_comments,
      operator_comments,
      //error with checkboxes
      sci_objective_met,
      equipment_function,
      other_comments
    } = req.body;

    const sql = 'UPDATE expedition SET ship_name = ?, purpose = ?, chief_scientist = ?, principal_investigator = ?, sch_start = ?, sch_end = ?, equip_description = ?, participants = ?, region_description = ?, planned_track_description = ?, post_cruise_complete = ?, actual_start = ?, actual_end = ?, accomplishments = ?, scientist_comments = ?, operator_comments = ?, sci_objective_met = ?, equipment_function = ?, other_comments = ? WHERE expedition_ID = ?';

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
      post_cruise_complete,
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


module.exports = router;

