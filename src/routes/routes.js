const express = require('express');
const router = express.Router();
const { executeSQL,
  getChiefScientists,
  getPrincipalInvestigators,
  getExpedition,
  getAllCruises,
  addExpedition,
  updatePost,
  updateExpedition,
  getAllDives,
  getDive, 
  getUsersByOccupation,
  getUsersByRole } = require('../controllers/sql.js');
  const { isAuthenticated } = require('../controllers/middleware.js');
const app = express();
//need this to get data from webpage
router.use(express.urlencoded({ extended: true }));
const saltRounds = 10;
const bcrypt = require('bcrypt');
const path = require('path'); 
app.use('/css', express.static(path.join(__dirname, 'src/views/css')));

router.get("/", async function(req, res) {
  res.render('login');
});

router.get("/home", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  let role = await getUsersByRole();
  res.render('home', { "role": role});
});

router.get("/search", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('search');
});

router.get("/preexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  let scientists = await getChiefScientists();
  console.log(scientists);
  let investigators = await getPrincipalInvestigators();
  console.log(investigators);
  res.render('preexp', {"scientists": scientists, "investigators": investigators});
});

router.get("/login", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('login');
});

router.get("/signup", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('signup');
});

//what is this for?
router.get("/mbari-employee-dashboard", async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('mbari-employee-dashboard');
});

router.get("/postexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('postexp');
});

//middlware to pass expedition_id to update Post
router.get("/updatePost/:exp_id", isAuthenticated, async function(req, res) {
  let info = await getExpedition(req.params.exp_id);
  res.render('postexp', { "info": info, "userID":req.session.userId});
});

//middlware to pass expedition_id to update
router.get("/update/:exp_id", isAuthenticated, async function(req, res) {
  let expedition = await getExpedition(req.params.exp_id);
  let scientists = await getChiefScientists();
  let investigators = await getPrincipalInvestigators();
  let dives = await getAllDives(req.params.exp_id);
  res.render('update', { "expedition": expedition, "scientists": scientists, "investigators": investigators, "dives": dives});
});

router.get("/dive", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('dive');
});

router.get("/test", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('test');
});

router.get("/dbTest", async function(req, res) {
  // Create table to test
  let sql = "SELECT * FROM Users";
  let rows = await executeSQL(sql); // Assuming executeSQL is a function to execute SQL queries
  res.send(rows);
});

router.get("/allcruises", isAuthenticated, async function(req, res) {
  let rows = await getAllCruises();
  console.log(rows);
  res.render('allcruises', { "rows": rows});
});

router.get("/searchResults", isAuthenticated, async function(req, res) {
  console.log("here")
  console.log(req.body);
  //res.render('searchResults', { expeditionResults: result, diveResults: diveResult });
});

//temporary route to get last entry
router.get("/getLastEntry", isAuthenticated, async function(req, res) {
  let sql = 'SELECT * FROM expedition ORDER BY expedition_ID DESC LIMIT 1;';
  let rows = await executeSQL(sql);
  res.send(rows);
});

router.post("/addPrecruise", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    const result = addExpedition(req.body);

    console.log("Insert result:", result);

    //redirect differently, give notification that it was entered correctly. 
    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//postcruise update
router.post("/updatePost/:exp_id", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    const result = await updatePost(req.body, req.params.exp_id);

    console.log("Insert result:", result);

    //temporary redirect
    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//postcruise update
router.post("/updateDive/:exp_id/:dive_number", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    //create similar function to updateDive
    //const result = await updatePost(req.body, req.params.exp_id);

    console.log("Insert result:", result);

    //temporary redirect
    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/updateExpedition", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    const result = await updateExpedition(req.body)

    console.log("Update result:", result);

    //temporary redirect
    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/login', async (req, res) => {
  const { email, pwd } = req.body;

  let sql = 'SELECT user_ID, password, role FROM person WHERE email = ?';
  let results = await executeSQL(sql, [email]);
  console.log(results);
  if (results.length === 0) {
      // No user found with that email
      return res.render('login', { errorMessage: 'Invalid email or password.' });
  }
    const userId = results[0].user_ID
    const dbPassword = results[0].password;
    const dbRole = results[0].role;
    bcrypt.compare(pwd, dbPassword, (err, match) => {
      if (err) {
          console.error('Error verifying password: ' + err.message);
          return res.status(500).send('Internal Server Error');
      }
      if (!match) {
          return res.render('login', { errorMessage: 'Invalid email or password.' });
      }
      if (match) {
        console.log("successful login")
        
        req.session.authenticated = true;
        req.session.userId = userId;
        req.session.position = dbRole;
        console.log(req.session)
        req.session.save()
        res.redirect('/home');
      }
    });
});

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, role, occupation } = req.body;

  try {
    // First, hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into the 'person' table. Adjust this according to the actual structure of the 'person' table
    let sql = 'INSERT INTO person (email, password, first_name, last_name, role, occupation) VALUES (?, ?, ?, ?, ?, ?)';
    await executeSQL(sql, [email, hashedPassword, firstname, lastname, role, occupation]);

    res.status(201).redirect('/login');
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;