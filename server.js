// server.js

// BASE SETUP
// =======================================================

// call the packages we need
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;    // set our port

var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost/nodeapi');

var Bear = require('./app/models/bear');

// ROUTES FOR OUR API
// ======================================================
var router = express.Router();  // get an instance of the express router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET
// http://localhost:8080/api
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our api will happen here

// on routes that end in /bears
// ----------------------------

router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear Created!' });
        });

    })
    .get(function(req, res) {
        Bear.find(function(err, bears){
            if (err)
                res.send(err);
            res.json(bears);
        });
});

router.route('/bears/:bear_id')
    .get(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            bear.name = req.body.name;

            bear.save(function(err){
                if (err)
                    res.send(err);
                res.json({ message: 'Bear Updated!' });
            });
        });
    })

    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
            if (err)
                res.send(err);
            res.json({ message: 'Bear deleted!' });
        });
    });

// REGISTER OUR ROUTES ---------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ======================================================
app.listen(port);
console.log('Magic happens on port ' + port);
