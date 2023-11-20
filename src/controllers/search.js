const { executeSQL } = require('../controllers/sql.js');

async function getSearchResults(data){
  console.log(data);
  /////VARIABLES////

  const {
    shipName,
    status,
    startDate,
    endDate,
    singleDate,
    //diveNumber,
    purpose,
    siteTrack,
    accomplishments,
    operatorComments,
    scientistComments,
    sequenceNumber,
    yyyyddd,
    participants,
    chiefScientist,
    principalInvestigator,
    dataComments
  } = data;

  /////END OF VARIABLES////

  
  let sql = 'SELECT * FROM expedition WHERE 1=1'; //Sets up the SQL query 
  //let diveSQL = 'SELECT * FROM dive WHERE dive_number = ' //query for dive number specifically 

  if(shipName)
    sql += ' AND ship_name = ${req.body.shipName}';

  if(status)
    sql += ' AND status = ${status}';

  if(startDate)
    sql += ' AND actual_start = ${startDate}';
   
  if(endDate)
    sql += ' AND actual_end = ${endDate}';

  if(singleDate)
    sql += ' AND ${singleDate} BETWEEN actual_start AND actual_end';
  
if(diveNumber)
    diveSQL += '${diveNumber}';
  
  if(purpose)
    sql += ' AND purpose LIKE ${purpose}';
   
  if(accomplishments)
    sql += ' AND accomplishments LIKE ${accomplishments}';
   
  if(operatorComments)
    sql += ' AND operator_comments LIKE ${operatorComments}';

  if(scientistComments)
    sql += ' AND scientist_comments LIKE ${scientistComments}'; 

  //SEQUENCE NUMBER HERE

  if(yyyyddd)
    sql += ' AND (DATE_FORMAT(actual_start, %Y%j) = YYYYDDD OR DATE_FORMAT(actual_end, %Y%j) = YYYYDDD)';
  
   
  if(participants)
    sql += ' AND participants LIKE ${participants}';

  if(chiefScientist)
    sql += ' AND chief_scientist = ${chiefScientist}';

  if(principalInvestigator)
    sql += ' AND principal_investigator = ${principalInvestigator}';

  let result = await executeSQL(sql);
  //let diveResult = await executeSQL(diveSQL);
  console.log(result);
  return result
}

module.exports = {
  getSearchResults
}
