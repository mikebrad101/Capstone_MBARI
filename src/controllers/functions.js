let attempt = 0;

function clickCounter(event) {
    // Sample logic for validating the password
    // and the server should send a response about whether the login attempt was successful or not.
    let username = document.querySelector('[name="username"]').value;
    let password = document.querySelector('[name="pwd"]').value;
    
    if (!isValidLogin(username, password)) { 
        attempt++;
        
        if (attempt >= 5) {
            document.querySelector('button').disabled = true;
            document.querySelector('p').textContent = "Too many wrong attempts! Please wait.";
            event.preventDefault(); // Prevent form submission
        } else {
            document.querySelector('p').textContent = "Incorrect login! You have " + (5 - attempt) + " attempts left.";
            event.preventDefault(); // Prevent form submission
        }
    }
}

function isValidLogin(username, password) {
    // dummy example
    return username === 'admin@example.com' && password === 'password123'; // Example login
}
// fix this

module.exports.authenticateUser = function(username, password, callback){
    connection.query('SELECT password, role FROM Users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            callback('Error accessing database.');
            return;
        }

        if (results.length === 0) {
            callback('User not found.');
            return;
        }

        const dbPassword = results[0].password;
        const dbRole = results[0].role;

        bcrypt.compare(password, dbPassword, (err, result) => {
            if (err) {
                callback('Error comparing passwords.');
                return;8
            }
            
            if (!result) {
                callback('Incorrect password.');
                return;
            }

            // If everything is correct
            callback(null, dbRole);
        });
    });

}
function displayError(message) {
    document.getElementById("errorMessage").innerText = message;
}