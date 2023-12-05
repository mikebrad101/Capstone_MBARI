const express = require('express');
const router = express.Router();
const { getSearchResults } = require('../controllers/search.js');
const { executeSQL,
  getUserFullName,
  getChiefScientists,
  getPrincipalInvestigators,
  getExpedition,
  getAllCruises,
  getAllShips,
  addExpedition,
  updatePost,
  updateExpedition,
  allDives, 
  getAllDives,
  getDive, 
  updateDive,
  getUsersByRole,
  getMBARIEmployee,
  getLogisticsCoordinator,
  getRegisteredUser,
  getExpeditionsNeedingApproval } = require('../controllers/sql.js');
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
router.get("/aboutUs", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('aboutUs');
});


router.get("/search", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  //let ships = await getAllShips();
  let scientists = await getChiefScientists();
  let investigators = await getPrincipalInvestigators();
  let ships = await getAllShips();
  res.render('search', {
    "scientists": scientists,
    "investigators": investigators, 
    "ships": ships, 
    session: req.session // Add this line to pass session data
  }); 
});


router.get("/preexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  let scientists = await getChiefScientists();
  let investigators = await getPrincipalInvestigators();
  const mbariEmployees = await getUsersByRole('MBARI Employee');

  res.render('preexp', {
    "scientists": scientists, 
    "investigators": investigators, 
    "role": mbariEmployees,
    session: req.session // Add this line to pass session data
  });
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
router.get('/mbari-employee-dashboard/:userId', isAuthenticated, async (req, res) => {
  //in route we get sql statement and data
  //then send it to the view using render
  try {
    // Get the users with the 'MBARI Employee' role
    const userId = req.params.userId;
    const mbariEmployees = await getMBARIEmployee();
    const registeredUsers = await getRegisteredUser();
    const logisticsCoordinators = await getLogisticsCoordinator();

    res.render('mbari-employee-dashboard', { userId, 
      mbariEmployees, 
      registeredUsers,
      logisticsCoordinators,
      session: req.session // Add this line to pass session data
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/logistics-coordinator-dashboard/:userId", isAuthenticated, async function(req, res) {
  try {
    // Get the expeditions needing approval data
    const expeditionsNeedingApproval = await getExpeditionsNeedingApproval(req.body);
    let expedition = await getExpedition(req.params.exp_id);
    const logisticsCoordinators = await getLogisticsCoordinator();
    const mbariEmployees = await getMBARIEmployee();
    const registeredUsers = await getRegisteredUser();


    // Render the logistics-coordinator-dashboard template with the data
    res.render('logistics-coordinator-dashboard', { 
      "approval" :expeditionsNeedingApproval, 
      "expedition": expedition, 
      logisticsCoordinators,
      mbariEmployees,
      registeredUsers,
      session: req.session // Add this line to pass session data
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/registered-user-dashboard/:userId", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  try {
    // Get the users with the 'Registered User' role
    const registeredUsers = await getRegisteredUser();
    const logisticsCoordinators = await getLogisticsCoordinator();
    const mbariEmployees = await getMBARIEmployee();

    // Render the registered-user-dashboard template with the data
    res.render('registered-user-dashboard', { 
      registeredUsers ,
      logisticsCoordinators,
      mbariEmployees,
      session: req.session // Add this line to pass session data

    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/postexp", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  res.render('postexp');
});

//middlware to pass expedition_id to update Post
router.get("/updatePost/:exp_id", isAuthenticated, async function(req, res) {
  let info = await getExpedition(req.params.exp_id);
  res.render('postexp', { 
    "info": info, 
    "userID":req.session.userId,
    session: req.session // Add this line to pass session data
  });
});

//middlware to pass expedition_id to update
router.get("/update/:exp_id", isAuthenticated, async function(req, res) {
  let expedition = await getExpedition(req.params.exp_id);
  let scientists = await getChiefScientists();
  let investigators = await getPrincipalInvestigators();
  let dives = await getAllDives(req.params.exp_id);
  
  res.render('update', { 
    "expedition": expedition,
    "scientists": scientists, 
    "investigators": investigators, 
    "dives": dives,
    session: req.session // Add this line to pass session data

  });
});

//mike is finishing this
router.get("/editDive/:dive_ID", isAuthenticated, async function(req, res) {
  let scientists = await getChiefScientists();
  let dive = await getDive(req.params.dive_ID);
  res.render('editDive', { 
    "scientists": scientists,
    "dive": dive,
    session: req.session // Add this line to pass session data
  });
});

//needs to pass a expedition_id to associate dive to expedition
router.get("/dive", isAuthenticated, async function(req, res) {
  //in route we get sql statement and data
  //then send it to the view using render
  let scientists = await getChiefScientists();
  
  res.render('dive', {
    "scientists": scientists,
    session: req.session // Add this line to pass session data
  });
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
  //console.log(rows);
  res.render('allcruises', { "rows": rows});
});

router.post("/searchRequest", isAuthenticated, async function(req, res) {
  console.log("here");
  //console.log(req.body);
  
  try {
    const results = await getSearchResults(req.body);
    const dives = await allDives(); 
    //console.log(results);
    for (let i = 0; i < results.length; i++) {
      results[i].chief_scientist = await getUserFullName(results[i].chief_scientist);
      results[i].principal_investigator = await getUserFullName(results[i].principal_investigator);
    }
    res.render('searchResults', {
       dives: dives,
       expeditionResults: results,
       session: req.session // Add this line to pass session data
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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

    //console.log("Insert result:", result);

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

    //console.log("Insert result:", result);

    //temporary redirect
    res.redirect('/getLastEntry');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Dive update
router.post("/updateDive/:dive_id", isAuthenticated, async function(req, res) {
  try {
    console.log(req.body);

    //create similar function to updateDive
    const result = await updateDive(req.body, req.params.dive_id);

    //console.log("Insert result:", result);

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

  try {
    let sql = 'SELECT user_ID, password, role FROM person WHERE email = ?';
    let results = await executeSQL(sql, [email]);

    if (results.length === 0) {
      // No user found with that email
      return res.render('login', { errorMessage: 'Invalid email or password.' });
    }

    const userId = results[0].user_ID;
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

      // Passwords match
      console.log("Successful login");

      req.session.authenticated = true;
      req.session.userId = userId;
      req.session.position = dbRole;

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session: ' + err.message);
          return res.status(500).send('Internal Server Error');
        }

        // Redirect logic based on user role
        switch (dbRole) {
          case 'MBARI Employee':
            res.redirect(`/mbari-employee-dashboard/${userId}`);
            break;

          case 'Logistics Coordinator':
            res.redirect(`/logistics-coordinator-dashboard/${userId}`);
            break;

          case 'Registered User':
            res.redirect(`/registered-user-dashboard/${userId}`);
            break;

          // Add more cases for other roles as needed

          default:
            res.redirect('/login');
            break;
        }
      });
    });
  } catch (error) {
    console.error('Error executing SQL query: ' + error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session: ' + err.message);
      return res.status(500).send('Internal Server Error');
    }

    // Redirect to the login page after logout
    res.redirect('/login');
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