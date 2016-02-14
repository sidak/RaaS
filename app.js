var express = require('express');
// Utilities for dealing with file paths
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var services = require('./routes/services');
var init = require('./routes/init');
var configure = require('./routes/configure');
var feedback = require('./routes/feedback');

// The json data for the service tree
// var service_data = require('./sample_data/paper_example');

// -----------------------------------------------
// TODO: Integrate Redis
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

function insertRoot (req, res){
	var reqRoot = req.body.root;
	var db = req.db;
	var clln = db.collection(CLLN_NAME);
	services.onParentUpdated(clln, META, reqRoot, function (err, result){
		if(err)console.log(err);
		else if (result!=null){
			//console.log(result);
			console.log(result);
			console.log(result["ops"][0]["_id"]);
			services_id[reqRoot]=result["ops"][0]["_id"];
			res.send("System initialised with root " + reqRoot +" with id "+ result["ops"][0]["_id"]);
		}
	});
}
// Routes

//  use Express’s router.route() to handle multiple routes for the same URI
// ------------------------------------------------------------------
// initialise should create the database and the collection 
// and populate with the root

router.post('/init', init.initialise, insertRoot);
router.get('/init/:fileName', init.initialiseFromFile);

router.post('/services',services.addService);

router.get('/services', services.findAllServices);
router.delete('/services', services.deleteAllServices);

router.get('/services/:id', services.findServiceById);

router.delete('/services/:id', services.deleteServiceById);

router.post('/services/:id/reviews', services.addReviewForService);
router.get('/services/:id/reviews', services.getAllReviewsForService);

router.get('/feedback/:id', feedback.getFeedbackById);
router.get('/feedback', feedback.getCompleteFeedback);
router.get('/rawAverage', feedback.getRawAverageFeedback);

// TODO
/*
router.get('/configure', configure.getCompleteConfiguration);
router.post('/configure', configure.setCompleteConfiguration);
router.put('/configure', configure.updateCompleteConfiguration);
router.delete('/configure', configure.deleteCompleteConfiguration);


router.get('/configure/:id', configure.getConfigurationById);
router.post('/configure/:id', configure.setConfigurationById);
router.put('/configure/:id', configure.updateConfigurationById);
router.delete('/configure/:id', configure.deleteConfigurationById);
*/
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
