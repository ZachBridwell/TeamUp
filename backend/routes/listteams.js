const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.urlencoded({extended:false}));
/*router.get('/', async(req,res) => {
    // Listing all active teams
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            res.locals.teamlist = db.collection('team').find({alive: true}).toArray();

            client.close();
        });
    } catch(err) {
        console.log(error);
        res.status(400).json({err:error})
    }
});*/

router.get('/', async(req,res) => {
    // Searching team
    //console.log(req.query);
    const {name, owner, members, info, skills, open, course} = req.query;
    
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology:true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            let filter_list = [];
            if(name) filter_list.push({teamname:name});
            if(owner) filter_list.push({owner:ObjectID(owner)});
            if(members) filter_list.push({members:members});
            if(info) filter_list.push({info:info});
            if(skills) filter_list.push({skills:skills});
            if(open === 'true') filter_list.push({open:true});
            if(open === 'false') filter_list.push({open:false});
            if(course) filter_list.push({course:course});

            if(filter_list.length === 0) {
                //return all teams
                //console.log("Hello");
                db.collection('team').find({alive: true}).toArray().then(teams => {
                    console.log(teams);
                    client.close();
                    res.status(200).json(teams);
                    return;
                })
            } else {
                db.collection('team').find({
                    $and: 
                        [{$or: filter_list}, 
                        {alive:true}]
                    }
                ).toArray()
                .then(teams => {
                    console.log(teams);
                    client.close();
                    res.status(200).json(teams);
                    return;
                })
    
                client.close();
            }
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

    // Filter teams based on class
    /*
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Looking for class = the filter string
            res.locals.teamlist = db.collection('team').find(
                {$and:
                    [{class: req.searchteam},
                    {alive: true}]
                });

            client.close();
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

    // Filter teams based on open or restricted
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Looking for open = the filter string
            res.locals.teamlist = db.collection('team').find(
                {$and: 
                    [{open: req.searchteams},
                      {alive: true}]
                });

            client.close();
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }*/
});

module.exports = router;