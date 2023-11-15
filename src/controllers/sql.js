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
// Use the connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection from pool:', err);
    return;
  }

  // Perform database operations

  // Release the connection back to the pool
  connection.release();
});

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