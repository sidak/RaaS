var express = require('express');
// Utilities for dealing with file paths
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var services = require('./routes/services');
var configure = require('./routes/configure');
var feedback = require('./routes/feedback');

//var users = require('./routes/users');
// The json data for the service tree
// var service_data = require('./sample_data/paper_example');

var mongodb =require('mongodb');
var mongoClient = mongodb.MongoClient;

// connection url - where our mongodb server is running
var url = 'mongodb://localhost:27017/raas';

mongoClient.connect(url, function (err, db){
	if(err)console.log(err);
	else {
		express.request.db=express.response.db=db;
	}
});

// GLOBAL VARIABLES ----------------------------
services_id={};
element_list=[];				
service_root;
queue =[];
services_children={};
services_siblings={};
services_tv={};
services_owr={};
services_uwr={};
services_rtv={};
services_ars={};
// ------------------------------------------------

// GLOBAL CONSTANTS -------------------------------------

//-----------system parameters----------------------------
// TODO: Experiment with the values and analyze the results

alpha = 0.6;
beta = 0.5;
gamma1 = 0.75; 
// for siblings
gamma2 = 0.25; 
// for cousins

//---------------------- CONSTANTS---------------
CLLN_NAME = "services";
META= "meta";
KEY_NAME="name";
KEY_ARS="agg_rating_score";
KEY_ORC="own_rating_cont";
KEY_CRC="children_rating_cont";
KEY_OWR="own_wmean_rating";
KEY_UWR="universe_wmean_rating";
KEY_CRa="consumer_ratings";
KEY_CRe="consumer_relevance";
KEY_CFCt="consumer_feedback_count";
KEY_RTV="rating_trust_value";
KEY_TV="trust_votes";
KEY_CHILDREN="children";
KEY_SIBLINGS="siblings";
KEY_PARENT="parent";
KEY_CHILDREN_NAME="name";
KEY_CHILDREN_WT="wt";

// -----------------------------------------------

var service_data = require('./sample_data/fifaReviewData');
var redis_data = require('./sample_data/new_feedback');

var app = express();

// ----------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
//var router= app.Router(); 


// Routes

//  use Express’s router.route() to handle multiple routes for the same URI
// ------------------------------------------------------------------
// initiliase should create the database and the collection 
// and populate with the root

//router.post('/init', init.initialise);

router.post('/services',services.addService);

router.get('/services', services.findAllServices);
router.delete('/services', services.deleteAllServices);

router.get('/services/:id', services.findServiceById);

router.put('/services/:id', services.updateServiceById);
router.delete('/services/:id', services.deleteServiceById);

router.post('/services/:id/reviews', services.addReviewForService);
router.get('/services/:id/reviews', services.getAllReviewsForService);
router.delete('/services/:id/reviews', services.deleteAllReviewsForService);

router.get('/feedback/:id', feedback.getFeedbackById);
router.get('/feedback', feedback.getCompleteFeedback);

router.get('/configure', configure.getCompleteConfiguration);
router.post('/configure', configure.setCompleteConfiguration);
router.put('/configure', configure.updateCompleteConfiguration);
router.delete('/configure', configure.deleteCompleteConfiguration);


router.get('/configure/:id', configure.getConfigurationById);
router.post('/configure/:id', configure.setConfigurationById);
router.put('/configure/:id', configure.updateConfigurationById);
router.delete('/configure/:id', configure.deleteConfigurationById);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/api', router);


// error handlers
// --------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
