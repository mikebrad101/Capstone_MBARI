const db = require('../config/db.js');
const pool = db.tempDB();


async function executeSQL(sql, params) {
    return new Promise(function(resolve, reject) {
      pool.query(sql, params, function(err, rows, fields) {
        if (err) throw err;
        resolve(rows);
      });
    });
}

module.exports = {
   executeSQL
};