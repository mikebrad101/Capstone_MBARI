const db = require('../config/db.js');
const pool = db.tempDB();


async function executeSQL(sql, params) {
  return new Promise(function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
      if (err) {
        console.error('Error executing query: ' + err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getUserFullName(user_id) {
  let sql = `SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM person WHERE user_ID = ?`;
  let rows = await executeSQL(sql, [user_id]);
  return rows[0].full_name;
}

async function getChiefScientists() {
  let sql = `SELECT * FROM person WHERE occupation = 'Chief Scientist'`;
  let scientists = await executeSQL(sql);
  return scientists;
}
async function getUsersByRole() {
  let sql = `SELECT * FROM person WHERE role = 'MBARI Employee'`;
  let users = await executeSQL(sql);
  return users;
}
async function getMBARIEmployee() {
  let sql = `SELECT * FROM person WHERE role = 'MBARI Employee'`;
  let users = await executeSQL(sql);
  return users;
}
async function getRegisteredUser() {
  let sql = `SELECT * FROM person WHERE role = 'Registered User'`;
  let users = await executeSQL(sql);
  return users;
}
async function getLogisticsCoordinator() {
  let sql = `SELECT * FROM person WHERE role = 'Logistics Coordinator'`;
  let users = await executeSQL(sql);
  return users;
}
async function getPrincipalInvestigators() {
  let sql = `SELECT * FROM person WHERE occupation = 'Principal Investigator'`;
  let investigators = await executeSQL(sql);
  return investigators;
}
async function getExpedition(exp_id) {
  let sql = `SELECT * FROM expedition WHERE expedition_ID = ?`;
  let expedition = await executeSQL(sql, [exp_id]);
  return expedition;
}

async function getAllCruises() {
  let sql = "SELECT * FROM expedition";
  let rows = await executeSQL(sql);
  return rows;
}

async function getAllShips() {
  let sql = `SELECT DISTINCT ship_name FROM expedition`;
  let ships = await executeSQL(sql);
  return ships;
}

async function addExpedition(data) {
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
  } = data;

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

  return result;
}

async function updatePost(data, id) {
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
  } = data;

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
    id
  ]);
  return result;
}

async function updateExpedition(data) {
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
  } = data;

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
  return result;
}

async function allDives(){
  let sql = "SELECT * FROM dive";
  let rows = await executeSQL(sql);
  return rows;
}

async function getAllDives(exp_id) {
  let sql = "SELECT * FROM dive WHERE expedition_ID = ?;";
  let rows = await executeSQL(sql, [exp_id]);
  return rows;
}

async function getDive(dive_id) {
  let sql = "SELECT * FROM dive WHERE dive_ID = ?;";
  let rows = await executeSQL(sql, [dive_id]);
  return rows;
}

async function updateDive(data, dive_id) {
  //Dive number is unique for and should not be changed
  const {
    ROV_name,
    dive_start,
    dive_end,
    dive_cheif_scientist,
    accomplishments
  } = data;

  //finish below
  let sql = `UPDATE dive
           SET ROV_name = ?,
           dive_start = ?,
           dive_end = ?,
           dive_cheif_scientist = ?,
           accomplishments = ?
           WHERE dive_number = ?;`;

  //fix below
  const result = await executeSQL(sql, [
    ROV_name,
    dive_start,
    dive_end,
    dive_cheif_scientist,
    accomplishments,
    exp_id,
    dive_id
  ]);
  return result;

}

async function getExpeditionsNeedingApproval(exp_app) {
  let sql = 'SELECT * FROM expedition WHERE expedition_status = "Planned";';

  let rows = await executeSQL(sql, [exp_app]);
  return rows;
}

module.exports = {
  executeSQL,
  getUserFullName,
  getChiefScientists,
  getPrincipalInvestigators,
  getExpedition,
  getAllCruises,
  getAllShips,
  addExpedition,
  updatePost,
  updateExpedition,
  getAllDives,
  allDives,
  getDive,
  updateDive,
  getUsersByRole,
  getMBARIEmployee,
  getRegisteredUser,
  getLogisticsCoordinator,
  getExpeditionsNeedingApproval
};