app.get('/views/search', isAuthenticated, async (req,res) => {
  
  /////VARIABLES////
  
  let shipName = req.body.shipName;
  let status = req.body.status;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let singleDate = req.body.singleDate;   
  let diveNumber = req.body.diveNumber; //TODO
  let purpose = req.body.purpose;
  let siteTrack = req.body.siteTrack; //Is this planned track, region description, or both? ASK MIKE
  let accomplishments = req.body.acomplishments;
  let operatorComments = req.body.operatorComments; 
  let scientistComments = req.body.scientistComments;
  let sequenceNumber = req.body.sequenceNumber; //TODO will need a seperate function 
  let yyyyddd = req.body.yyyyddd; //TODO will need a seperate function 
  let participants = req.body.participants;
  let chiefScientist = req.body.chiefScientist;
  let principalInvestigator = req.body.principalInvestigator;
  let dataComments = req.body.dataComments; //I think this corraltes to other comments ASK MIKE 
  
  /////END OF VARIABLES////

  
  let sql = 'SELECT * FROM expedition WHERE 1=1'; //Sets up the SQL query 
  let diveSQL = 'SELECT * FROM dive WHERE dive_number = ' //query for dive number specifically 

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

  //yyyyddd HERE
   
  if(participants)
    sql += ' AND participants LIKE ${participants}';

  if(chiefScientist)
    sql += ' AND chief_scientist = ${chiefScientist}';

  if(principalInvestigator)
    sql += ' AND principal_investigator = ${principalInvestigator}';

  let result = await executeSQL(sql);
  let diveResult = await executeSQL(diveSQL);
  
  //Send to the client

});