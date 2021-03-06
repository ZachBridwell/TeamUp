const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const verify = require('../verifyjwt');
const dbconfig = require('../db_config.json');

router.use(express.urlencoded({extended:false}));
//router.use(verify);

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
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const client = await MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology:true})
        const db = client.db('Teams');
        const cursor = db.collection('team').find({ _id:ObjectId(id) });
        let result = await cursor.toArray();
        if(result.length <= 0) {
            //couldn't find team
            res.status(404).json({err:"Team not found"});
            return;
        }
        if(result.length > 1) {
            //found >1 team with that id
            res.status(500).json({err:"Server Error"});
            return;
        }
        //res.length === 1
        result = result[0];
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get('/', async(req,res) => {
    // Searching team
    //console.log(req.query);
    const name = req.query.search, info = req.query.search, skills = req.query.search, course = req.query.search;
    //const owner = req.token //has id and username stored

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology:true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            let filter_list = [];
            if(name) filter_list.push({teamName:{$regex: new RegExp(name,'i')}});
            if(info) filter_list.push({info:{$regex: new RegExp(info,'i')}});
            if(skills) {
                filter_list.push({requestedSkills: {$elemMatch: {$elemMatch: {$regex: new RegExp(skills,'i')}}}});
                filter_list.push({requestedSkills: {$elemMatch:{$regex: new RegExp(skills,'i')}}});
            }
            if(course) filter_list.push({course:{$regex: new RegExp(course,'i')}});

            //console.log(filter_list)

            if(filter_list.length === 0) {
                //return all teams
                //console.log("Hello");
                db.collection('team').find({alive: true}).toArray().then(teams => {
                    //console.log(teams);
                    client.close();
                    try{
                        //teams.push("All teams displayed successfully");
                        res.status(200).json(teams);
                        //res.status(200).send('All teams displayed successfully');
                    } catch(err){
                        console.log(err);
                    }
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
                    //console.log(teams[0].requestedSkills[0]);
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