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
  db.once('open', function() {
    console.log(db.readyState);  
  });

//create schema and model
  var userschema = new mongoose.Schema({
    name: String,
    email: String
  });
  var users = mongoose.model('users', userschema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Users' });
  //console.log(mongoose.connection.readyState);  //to check mongdb connection
});

router.get('/users', function (req, res, next) {
  users.find({}, function (err, data) {
    console.log(err, data, data.length);
    data.forEach(element => {
      console.log(element.name);
      console.log(element.email);
    });
    res.json(data);
    res.status(200);
  });
});

module.exports = router;
