const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const assert = require('assert');

router.use(express.json());
router.post('/', async (req,res) => {
    console.log("Signup", req.body);
    
    const {email, password, screenname} = req.body;
    if(!email || !password) {
        res.status(400).json({err:"Missing email, password, or screenname"});
        return;
    }
    
    var emailRegex = /\@purdue\.edu/
    if (emailRegex.test(email) == false) {
        console.log('must register with a purdue email address');
        res.status(400).json({err:"Invalid email"});
        return;
    }

    // Check password length
    if (password.length < 8 || password.length > 20) {
        console.log('password must be between 8 and 20 characters');
        res.status(400).json({err:'password must be between 8 and 20 characters'});
        return;
    }
    
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
    if (passwordRegex.test(password) == false) {
        res.status(400).json({err:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'});
        return;
    }
    
    var times = new Array(7);
    var sections = 37;
    for (var i = 0; i < times.length; i++) {
        times[i] = new Array(sections);
    }

    for (var i = 0; i < times.length; i ++) {
        for (var k = 0; k < sections; k++) {
            times[i][k] = false;
        }
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var cursor = db.collection('user').find({
                email: email
            });
        
            cursor.count().then(function(result) {
                // If the request returned another user, it already exists
                if (result != 0) {
                    console.log('User with that email already exists.');
                    res.status(400).json({err:'User with that email already exists'});
                    client.close();
                // If the request was empty, create the user    
                } else {
                    db.collection('user').insertOne({
                        times: times,
                        email: email,
                        password: password,
                        username: screenname,
                        prevTeams: [],
                        curTeams: [],
                        rating: -1,
                        skills: [],
                        bio: "",
                        blockedUsers: [],
                        invites: []
                    }).then(function(count){
                        console.log('User successfully created');
                        res.status(201).json({message:'User successfully created'});
                        client.close();
                    }).catch(function (err) {
                        console.log(err);
                        res.status(400).json({err:err});
                        client.close();
                    });
                }
            });
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;