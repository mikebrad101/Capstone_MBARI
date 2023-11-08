const db = require('../config/db.js');
const pool = db.tempDB();


async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) {
        console.error('Error executing query: ' + err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getChiefScientists(){
  let sql = `SELECT * FROM person WHERE occupation = 'Chief Scientist'`;
  let scientists = await executeSQL(sql);
  return scientists;
}
async function getPrincipalInvestigators(){
  let sql = `SELECT * FROM person WHERE occupation = 'Principal Investigator'`;
  let investigators = await executeSQL(sql);
  return investigators;
}

module.exports = {
   executeSQL,
   getChiefScientists,
   getPrincipalInvestigators
};