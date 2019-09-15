const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// TODO: email, username, and password values need to come from textboxes

var email = "burns140@purdue.edu";
var username = "fdsaa77778";
var password = "V4lidPassword$";

// Confirm it's a purdue email
var emailRegex = /\@purdue\.edu/
if (emailRegex.test(email) == false) {
    // TODO: set popup text to say invalid email
    console.log('invalid email');
    return;
} else {
    console.log('valid email: ' + email);
}

// Check password length
if (password.length < 8 || password.length > 20) {
    // TODO: set popup to say password length is wrong
    console.log('password must be between 8 and 20 characters');
    return;
}

// Make sure password is valid
var passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
if (passwordRegex.test(password) == false) {
    // TODO: set popup to say password requirements
    console.log('password must contain at least one uppercase letter, one lowercase \
letter, one number, and one special character');
    return;
} else {
    console.log('valid password: ' + password);
}

// Check username length
if (username.length < 5 || username.length > 16) {
    // TODO: set popup about username length
    console.log('username must be between 5 and 16 characters');
    return;
}

// Make sure username is valid
var usernameRegex = /^[0-9a-zA-Z@#$%^&*()_]/
if (usernameRegex.test(username) == false) {
    // TODO: set popup to say username requirements
    console.log('invalid username');
    return;
} else {
    console.log('valid username: ' + username);
}

function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
}
 
function errorFunc(error) {
    if (error != null) {
        console.log(error);
    }
}

// Url to connect to server
const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

// Create Connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Users");

    var cursor = db.collection('user').find({
        $or: [ {email: email}, {username: username} ]
    });

    cursor.count().then(function(result) {
        
        // If the request returned another user, it already exists
        if (result != 0) {
            console.log('User with that username or email already exists.');
            cursor.forEach(iterateFunc, errorFunc);
            client.close();
        
        // If the request was empty, create the user    
        } else {
            db.collection('user').insertOne({
                email: email,
                password: password,
                username: username
            }).then(function(count){
                console.log('User successfully created');
                client.close();
            }).catch(function (err) {
                console.log('User creation failed');
                console.log(err);
            });
        }
    });
});
