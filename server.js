// imports
const express = require('express');
const bodyParser= require('body-parser');
const mongodb = require('mongodb');
const session = require('express-session');
var cors = require('cors')
var mongoose = require('mongoose')
const pug = require('pug');

const Animals = require('./models/Animals');
const User = require('./models/Users');

const app = express();
app.use(cors())

// constants
const dbname = 'mydb';
const url= 'mongodb://127.0.0.1/mydb';
const port = 4106;

let db;


// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
   secret: 'some-secret',
   resave: true,
   saveUninitialized: true,
   userId: '',
   sessionType: 'offline'
}));

//Authentication and Authorization Middleware
var auth = function(req, res, next) {
   if (req.session.sessionType === 'online')
     return next();
   else
     return res.status(401).send("Zaloguj się aby to zobaczyć.");
 };

//connect to database



// start server
app.listen(port,function() {
    console.log('listening on ' + port);
 })


// routes
app.get('/style.css', function(req,res) {
    res.sendFile(__dirname + '/style.css');
 })

 app.get('/ajax.js', function(req,res) {
    res.sendFile(__dirname + '/ajax.js');
 })
 
 app.get('/local_storage.js', function(req,res) {
    res.sendFile(__dirname + '/local_storage.js');
 })
 
app.get('/', function(req,res) {
    result = pug.renderFile('templates/documentation.pug');
    res.status(200).send(result);
 })
 
app.get('/analytics', auth, function(req,res) {
    result = pug.renderFile('templates/analytics.pug');
    res.status(200).send(result);
 })
 
app.get('/analytics_data',auth, async function(req,res) {
    animals = await Animals.find({user_id:req.session.userId}).lean().exec(function (err, db_results) {
        if(err) 
        {
            return console.log(err);
        }
        res.status(200).send(db_results);
    });
})

app.post('/analytics_daily',auth,async function(req,res){
    let date = req.body.date;
    date = new Date(date);
    console.log(date);
    let day_after = new Date(date.valueOf())
    day_after.setDate(day_after.getDate()+1);

    animals = await Animals.find({user_id:req.session.userId,
        date: {
            $gte: date,
            $lt: day_after
        }
    }).lean().exec(function(err, db_results){
        if(err) 
        {
            return console.log(err);
        }
        res.status(200).send(db_results);
    })
})
 
app.get('/login', function(req,res) {
    result = pug.renderFile('templates/login.pug');
    res.status(200).send(result);
 })

 app.post('/login', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},()=>console.log("connected to DB!"));
        db = mongoose.connection;
        const count = await User.find({username:username,password:password}).countDocuments();
        const user = await User.find({username:username,password:password});
        if(count===1)
        {
            req.session.userId = user[0]._id;
            req.session.sessionType = "online"
            res.status(200).json({user});
        }
        else{
            db.close();
            console.log('disconnected');
            res.status(401).send("nie udało się zalogować - złe dane");
        }
    }
    catch(err){
        res.json({message:err});

    }

})

app.get('/register', function(req,res) {
    result = pug.renderFile('templates/register.pug');
    res.status(200).send(result);
 })

 app.post('/register', async (req,res)=>{
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},()=>console.log("connected to DB!"));
    db = mongoose.connection;
    let username= req.body.username;
    const count = await User.find({username:username}).countDocuments();
    if(count===0){
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        try{
            const savedUser = await user.save();
            res.json(savedUser)
        }
        catch(err) {
            res.json({message: err})
        }
    }
    else{
        res.status(409).send("taki user już istnieje")
    }

    db.close();
});
 
 
app.get('/logout', function(req,res) {
    if(mongoose.connection.readyState==1)
    {
        req.session.sessionType='offline';
        db.close();
        console.log("logout successful");
    }
    else{
        console.log("you weren't logged in!")
    }
    result = pug.renderFile('templates/documentation.pug');
    res.status(200).send(result);
 })
 
 app.get('/survey', function(req,res) {
    if(req.session.sessionType=='online'){
        result = pug.renderFile('templates/survey.pug');
    }
    else{
        result = pug.renderFile('templates/survey_offline.pug');
    }
    res.status(200).send(result);
 })
 
 
 // CREATE
 app.post('/survey', async function( req,res ) {
     if(req.session.sessionType=='online')
     {
        const animal = new Animals({
            user_id : req.session.userId,
            animal: req.body.animal,
            description: req.body.feelings,
            quantity: req.body.quantity
        });
        try{
            const savedAnimal = await animal.save();
            res.json(savedAnimal)
        }
        catch(err) {
            res.json({message: err})
        }
     }
     else{
        res.status(401).send("Zaloguj się aby przesłać wyniki.");
     }

 })
 
 
 // READ ALL
 app.get('/survey_results',auth, async function(req, res) {
    animals = await Animals.find({user_id:req.session.userId}).lean().exec(function (err, db_results) {
        if(err) 
        {
            return console.log(err);
        }
        result = pug.renderFile('templates/survey_results.pug', {db_results});
        res.status(200).send(result);
    });
 })
 
 app.get('/survey_results_offline', function(req, res) {
    if(req.session.sessionType != 'online'){
       result = pug.renderFile('templates/survey_results_offline.pug');
       res.status(200).send(result);
    }else {
       res.status(401).send("Wyloguj się aby zobaczyć wyniki offline.");
    }
 })

