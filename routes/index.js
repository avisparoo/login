var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb+srv://apoorva:apoorva123@cluster0-xv4i2.mongodb.net/login?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  });

//to check mongdb connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
  /*db.once('open', function() {
  console.log(db.readyState);
});*/

//create schema and model
  var userschema = new mongoose.Schema({
    name: String,
    email: String,
    pass: String
  });
  var users = mongoose.model('users', userschema);

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.cookies['userid']){
    users.find({_id:req.cookies['userid']}, function (err, data) {
    res.redirect('/user');   
    });    
  }else{
    res.render('index', { title: 'Users' });    
  }
});

/* GET all users. */
router.get('/users', function (req, res, next) {
  users.find({}, function (err, data) {
    if (data.length<1){
      res.status(400);
      res.json({error:"No users in the collection"});
    }
    else{
    res.status(200);
    res.json(data);
    }
    
  });
});

/* GET register page. */
router.get('/register', function (req, res, next) {
  if(req.cookies['userid']){
    users.find({_id:req.cookies['userid']}, function (err, data) {
    res.redirect('/user');   
    });    
  }else{
    res.render('register', { title: 'Registration' });
  }
});

/* POST register page. */
router.post('/reg', function (req, res, next) {
  
  if (req.body.name == "" || req.body.email == "" || req.body.pass == "") {
    res.status(400);
    res.json({ error: "Invalid entry" });
  }
  else {
    //check if user already exists
    users.find({ email: req.body.email }, function (err, data) {
      if (data.length > 0) {
        res.status(400);
        res.json({ error: "User with same emailid already exists" });
      }
      else {
        // a document instance
        var entry = new users(req.body);
        // save model to database
        entry.save(function (err, users) {
          if (err) {
            console.error(err);
            res.status(400);
            res.json({ error: "Error while saving model to database" });
          }
          else {
            var q = users.name;
            res.status(200);
            res.json({ result: q });
          }
        });
      }
    });
  }
});

// POST to check login. 
router.post('/login', function (req, res, next) {
  if (req.body.email == "" || req.body.pass == "") {
    res.status(400);
    res.json({ error: "Invalid entry" });
  } else {
    users.find({ email: req.body.email }, function (err, data) {
      if (data.length !== 1) {
        res.status(400);
        res.json({ error: "User does not exist" });
      } else if (data[0].pass !== req.body.pass) {
        res.status(400);
        res.json({ error: "Password is incorrect" });
      } else {
        
        //set cookie here
        res.cookie('userid', data[0].id);
        res.status(200);
        res.send();
      }
    });
  }
});

//GET user page.
router.get('/user', function (req, res, next) {
  if(req.cookies['userid']){
    users.find({_id:req.cookies['userid']}, function (err, data) {
      res.render('user', { user: data.name });
    });    
  }else{
    res.redirect('/');    
  }
});

module.exports = router;
