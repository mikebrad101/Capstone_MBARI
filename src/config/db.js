const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "t07cxyau6qg7o5nz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "mg6my0cujwumt4lr",
    password: "gnrv7rwzpmvpw19d",
    database: "tq38ylwyfie9f8a6"
  });

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});