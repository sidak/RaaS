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
//-----------system parameters----------------------------

var alpha = 0.6;
var beta = 0.5;
var gamma1 = 0.75; // for siblings
var gamma2 = 0.25; // for cousins

//---------------------- CONSTANTS---------------

var META= "meta";
var KEY_NAME="name";
var KEY_ARS="agg_rating_score";
var KEY_ORC="own_rating_cont";
var KEY_CRC="children_rating_cont";
var KEY_OWR="own_wmean_rating";
var KEY_UWR="universe_wmean_rating";
var KEY_CRa="consumer_ratings";
var KEY_CRe="consumer_relevance";
var KEY_RTV="rating_trust_value";
var KEY_TV="trust_votes";
var KEY_CHILDREN="children";
var KEY_PARENT="parent";
var KEY_CHILDREN_NAME="name";
var KEY_CHILDREN_WT="wt";


//--------------------- helper methods

// it assumes that connection has been established
function getJsonObjectByNameFromDB(name, collection, cb){
	var myCursor = collection.find({"name":name});
	myCursor.limit(1);			
	myCursor.each(function(err,result){
		if(err)cb(err);
		else if(result!=null){
			cb("", result);
		}
	});
}

//------------------
mongoClient.connect(url, function(err, db){
	if(err) console.log("there was an error: " ,err);
	else {
				
		console.log("connection esatblished to url ",url);
		var clln = db.collection("services");
		var service_data = [
					{ 
						name:"meta",						
						root:"a",
						numServices:7,
						serviceNames:["a","b1","b2","c1","c2","c3","c4"]					
					},
					{
						"name":"a",
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
			
					
					},
					{
						"name":"b1",
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
			
					
					},
					{	
						"name":"b2",
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
			
					
					},	
					{
						"name":"c1",
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
		
					
					},
					{					
						"name":"c2",
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
			
					
					},
					{
						"name":"c3",
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
			
					
					},
					{
							"name":"c4",
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
						
					
				];
		
		clln.insert(service_data, function(err, result){
			if(err)console.log("there was an error in inserting data : ",err);
			else {
				console.log("data inserted successfully and is :\n ", result);	
				console.log("now finding one doc \n\n");
				
				getJsonObjectByNameFromDB("meta", clln, function (err, result){
					if(err)console.log(err);
					else if (result!=null){
						var queue =[];
						var element_list=[];				
						var service_root = result.root;
						console.log("the root is ", service_root);
						console.log("\n the metadata is \n");					
						console.log(result);
						
						// do bfs from (root) and then do a reverse bfs  
						//bfs(queue, 
						
						
						// Async task (same in all examples in this chapter)
						function async(ele, callback) {
							console.log("it not fucked up even more");
							element_list.push(ele);
							// read the ele from db
							getJsonObjectByNameFromDB(ele, clln, function(err, result){
								if(err)callback(err);
								else{
									// get its json obj
									
									var s_obj= result;
									console.log(s_obj);
									var s_t_votes= 0;
									var s_relevance= s_obj[KEY_CRe];
									
									// TODO:	it's better to process these in batches or some units of feedback
									// otherwise the code will be a blocking code
									
									for(var i=0; i<s_relevance.length;i++){
										s_t_votes+=s_relevance[i];
									}
									var s_ratings=s_obj[KEY_CRa];
									var s_owr=0;
									for(var i=0; i<s_ratings.length;i++){
										s_owr+=(s_ratings[i]*s_relevance[i]);
									}
									s_owr/=s_t_votes;
									console.log("s_t_votes is ", s_t_votes);
									console.log("s_ownr is ",s_owr);
									// loop for it's children and push them into the queue
									var s_children = s_obj[KEY_CHILDREN];
									for(var i=0; i<s_children.length; i++){
										var s_child = s_children[i];
										queue.push(s_child[KEY_CHILDREN_NAME]);
									}
									
									// update tx and r(x)
									clln.update(
										{KEY_NAME:ele}, 
										{
											$set:{
												KEY_OWR:s_owr,
												KEY_TV:s_t_votes
											}
										},
										function (err, numUpdated){
											if(err)console.log(err);
											else if (numUpdated!=0){
												callback(null, numUpdated); 
											}
										}
									);
									
									
								}
							});
						}
						
						// Final task (same in all the examples)
						function final() { 
							console.log('Done updating'); 
							db.close();
						}

						// A simple async series:
						function series(element) {
						  if(element) {
							async( element, function(err, result) {
							  if(err){
								console.log(err);
							  }
							  else if (result!=null){
								  console.log( "Records updated : ", result);
								  return series(queue.shift());
							  }
							});
						  } else {
							return final();
						  }
						}
						
						queue.push(service_root);
						series(queue.shift());
						
					}
				});		
			}
		});	
	}		
});
