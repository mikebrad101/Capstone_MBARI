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
    return username === 'admin' && password === 'password123'; // Example login
}

function authenticateUser(username, password) {
    // checks authentication of specfic roles for each user logged in
    if(username == 'adminUser' && password == 'adminPass'){
        return 'admin';
    }else if (username === 'captainUser' && password === 'captainPass') {
        return 'captain';
    } else if (username === 'diverUser' && password === 'diverPass') {
        return 'diver';
    } else {
        return null;
    }

}