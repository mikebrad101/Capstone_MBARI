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