var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ----------------------------------------------------

var mongodb =require("mongodb");
var mongoClient = mongodb.MongoClient;
// connection url - where our mongodb server is running

var url = 'mongodb://localhost:27017/proto';

// ------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
//---------------------------------------

mongoClient.connect(url, function(err, db){
	if(err) console.log("there was an error: " ,err);
	else {
				
		console.log("connection esatblished to url ",url);
		var clln = db.collection("services");
		var service_data = [
					{ 
						root:"a",
						numServices:7,
						data:[
								{
									a:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[5,4],
										"consumer_relevance":[4,5],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[{"name":"b1","wt":0.5},{"name":"b2","wt":0.5}],
										"parent":[]
							
									}
								},
								{
									b1:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[2,3,3],
										"consumer_relevance":[4,5,4],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[{"name":"c1","wt":0.6},{"name":"c2","wt":0.4}],
										"parent":["a"]
							
									}
								},
								{	
									b2:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[5],
										"consumer_relevance":[5],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[{"name":"c3","wt":0.3},{"name":"c4","wt":0.7}],
										"parent":["a"]
							
									}
								},	
								{
									c1:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[4,4,5,3],
										"consumer_relevance":[5,3,4,3],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[],
										"parent":["b1"]
							
									}
								},
								{					
									c2:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[3,2,3],
										"consumer_relevance":[4,2,3],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[],
										"parent":["b1"]
							
									}
								},
								{
									c3:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[4,4],
										"consumer_relevance":[4,5],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[],
										"parent":["b2"]
							
									}
								},
								{
									c4:{
										"agg_rating_score":-1,
										"own_rating_cont":-1,
										"children_rating_cont":-1,
										"own_wmean_rating":-1,						
										"universe_wmean_rating":-1,
										"consumer_ratings":[5,5,4],
										"consumer_relevance":[4,5,4],
										"rating_trust_value":-1,
										"trust_votes":-1,
										"children":[],
										"parent":["b2"]
							
									}
								}
							]
					}
				];
		clln.insert(service_data, function(err, result){
			if(err)console.log("there was an error in inserting data : ",err);
			else {
				console.log("data inserted successfully and is :\n ", result);	
			}
					
		});
		
		var cursor = clln.find({trust_votes:-1});
		//cursor.limit(7);
		//cursor.sort({username:1});
		cursor.each(function(err, res){
			if(err)console.log(err);
			else {
				console.log('\n\n\n finding users with age 13 \n\n\n');
				console.log(res);
			}
			db.close();	
		});
			
		
		}	
});
