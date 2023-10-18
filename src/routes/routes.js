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

router.post("/addPrecruise", async function(req, res) {
  // Create table to test
  console.log(req.body);
  ship_name = req.body.shipName;
  purpose = req.body.purpose;
  chief_scientist = req.body.chief_scientist; 
  principal_investigator = req.body.principal_investigator; 
  sch_start = req.body.sch_start; 
  sch_end = req.body.sch_end; 
  equip_description = req.body.equip_description; 
  participants = req.body.participants; 
  region_description = req.body.region_description; 
  planned_track_description = req.body.planned_track_description; 
  //const {ship_name, purpose, chief_scientist, principal_investigator, 
   // sch_start, sch_end, equip_description, participants, region_description, 
    //planned_track_description } = req.body;
  const sql = 'INSERT INTO expedition (ship_name, purpose, chief_scientist, principal_investigator, sch_start, sch_end, equip_description, participants, region_description, planned_track_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await executeSQL(sql, [ship_name, purpose, chief_scientist, principal_investigator, 
      sch_start, sch_end, equip_description, participants, region_description, 
      planned_track_description]);
  res.send("Success");
});
module.exports = router;