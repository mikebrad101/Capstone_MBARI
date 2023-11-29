const { executeSQL } = require('../controllers/sql.js');

async function getSearchResults(data){
  console.log(data);

  const {
    shipName,
    status,
    startDate,
    endDate,
    singleDate,
    diveNumber, //TODO
    purpose,
    siteTrack, 
    accomplishments,
    operatorComments,
    scientistComments,
    sequenceNumber, //TODO
    yyyyddd, 
    participants,
    chiefScientist,
    principalInvestigator,
    dataComments 
  } = data;


  
  let sql = 'SELECT * FROM expedition WHERE 1=1'; //Sets up the SQL query 
  //let diveSQL = 'SELECT * FROM dive WHERE dive_number = ' //query for dive number specifically 

  const values =[]; 

  if(shipName){
    sql += ' AND ship_name = ?';
    values.push(shipName);
  }

  if(status){    
    sql += ' AND expedition_status = ?';
    values.push(status);
  }

  if(startDate){
    sql += ' AND DATE(actual_start) = ?';
    values.push(startDate);
  }

  if(endDate){
    sql += ' AND actual_end = ?';
    values.push(endDate);
  }  

  if(singleDate){
    sql += ' AND DATE(?) BETWEEN DATE(actual_start) AND DATE(actual_end)';
    values.push(singleDate);
  }
  
  // if (diveNumber) {
  //   sql += ' AND expedition_ID IN (SELECT expedition_ID FROM dive WHERE dive_number = ?)';
  //   values.push(diveNumber);
  // } 
  
  if(purpose){
    sql += ' AND purpose LIKE ?';
    values.push(purpose);
  }

  if (siteTrack) {
    sql += ' AND (planned_track_description LIKE ? OR region_description LIKE ?)';
    values.push(`%${siteTrack}%`, `%${siteTrack}%`);
}
   
  if(accomplishments){
    sql += ' AND accomplishments LIKE ?';
    values.push(accomplishments);
  }

  if(operatorComments){
    sql += ' AND operator_comments LIKE ?';
    values.push(operatorComments);
  }

  if(scientistComments){
    sql += ' AND scientist_comments LIKE ?';
    values.push(scientistComments); 
  }
  //SEQUENCE NUMBER HERE

  if (yyyyddd) {
    sql += ' AND (DATE_FORMAT(actual_start, "%Y%j") <= ? AND DATE_FORMAT(actual_end, "%Y%j") >= ?)';
    values.push(yyyyddd, yyyyddd);
}

   
  if(participants){
    sql += ' AND participants LIKE ?';
    values.push(participants);
  }

  if(chiefScientist){
    sql += ' AND chief_scientist = ?';
    values.push(chiefScientist);
  }

  if(principalInvestigator){
    sql += ' AND principal_investigator = ?';
    values.push(principalInvestigator);
  }

  if(dataComments){
    sql += ' AND (scientist_comments LIKE ? OR operator_comments LIKE ? OR other_comments LIKE ?)';
    values.push(`%${dataComments}%`, `%${dataComments}%`, `%${dataComments}%`); 
  }

  let result = await executeSQL(sql, values);
  console.log(result);
  return result
}


module.exports = {
  getSearchResults
}


/*
TO DO
-Dive implementation
-Sequence number implementation
*/