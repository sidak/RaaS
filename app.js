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
var KEY_SIBLINGS="siblings";
var KEY_PARENT="parent";
var KEY_CHILDREN_NAME="name";
var KEY_CHILDREN_WT="wt";

//------------------ global variables
var element_list=[];				
var service_root;
var queue =[];
var services_children={};
var services_siblings={};
var services_tv={};
var services_owr={};
var services_uwr={};
			
//--------------------- helper methods

// it assumes that connection has been established
function getJsonObjectByNameFromDB(collection, name, cb){
	var myCursor = collection.find({"name":name});
	myCursor.limit(1);			
	myCursor.each(function(err,result){
		if(err)cb(err);
		else if(result!=null){
			cb("", result);
		}
	});
}

function onConnectionEstablished(clln, cb){
	console.log('In function onConnectionEstablished: ');
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
					"parent":[],
					"siblings":[]
		
				
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
					"parent":["a"],
					"siblings":["b2"]
				
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
					"parent":["a"],
					"siblings":["b1"]
				
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
					"parent":["b1"],
					"siblings":["c2"]
	
				
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
					"parent":["b1"],
					"siblings":["c1"]
		
				
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
					"parent":["b2"],
					"siblings":["c4"]
		
				
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
					"parent":["b2"],
					"siblings":["c3"]
			
					
				}
					
				
			];
	
	clln.insert(service_data, function(err, result){
		if(err)cb(err);
		else {
			cb(null, 'Results of insertion are \n'+result);
					
		}
	});
}
function bfTraversalStep(clln, ele, callback) {
	element_list.push(ele);
	// read the ele from db
	getJsonObjectByNameFromDB( clln, ele, function(err, result){
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
			console.log("s_owr is ",s_owr);
			
			// update the local children and the siblings object
			services_children[s_obj[KEY_NAME]]= s_obj[KEY_CHILDREN];
			services_siblings[s_obj[KEY_NAME]]= s_obj[KEY_SIBLINGS];
			services_owr[s_obj[KEY_NAME]]= s_owr;
			services_tv[s_obj[KEY_NAME]]= s_t_votes;
			
			// loop for it's children and push them into the queue
			var s_children = s_obj[KEY_CHILDREN];
			for(var i=0; i<s_children.length; i++){
				var s_child = s_children[i];
				queue.push(s_child[KEY_CHILDREN_NAME]);
			}
			
			// update tx and r(x)
			clln.update(
				{"name":ele}, 
				{
					$set:{
						"own_wmean_rating":s_owr,
						"trust_votes":s_t_votes
					}
				},
				function (err, numUpdated){
					if(err)callback(err);
					else if (numUpdated!=0){
						callback(null, numUpdated); 
					}
				}
			);
			
			
		}
	});
}

function uwrCalcStep(clln, ele, callback) {
	// Update the value of Universe Weighted Mean 
	// Rating U(x) , for the node/service element 'ele'
	// And also calculate the value of the	U(x) for it's children 
	// and save it for use by them during the traversal
	
	var s_uwr=0;
	var s_name = ele;
	var s_uwr_children=0;
	
	// If the node is root then U(x) = R(x)
	// i.e, Universe Weighted Mean Rating is equal to
	// Own Weighted Mean Rating for the node
	// Otherwise get it from the services_uwr object
	
	if(s_name===service_root){
		s_uwr=services_owr[s_name];
		services_uwr[s_name]=s_uwr;
		
	}
	else {
		s_uwr= services_uwr[s_name];
		console.log('\n s_uwr from the services array is \n');
		console.log(s_uwr);
	}
	// Calculation of UWR for the child nodes 
	// UWR involves the contribution from the siblings 
	// with weight as gamma1 and from the cousins
	// with weight gamma2
	
	var siblings_ra_re=0;
	var siblings_tv=0;
	var cousins_ra_re=0;
	var cousins_tv=0;
	var s_children=[];
	var s_siblings=services_siblings[s_name];
	
	// The services_children array has children elements as json objects 
	// with name and edge weight as the keys 
	
	for(var i=0; i<services_children[s_name].length; i++){
		s_children.push(services_children[s_name][i][KEY_CHILDREN_NAME]);
	}
	
	console.log("s_siblings ",s_siblings);
	console.log("s_children ", s_children, '\n');
	
	if(s_children.length!=0){
		if(s_siblings.length!=0){
			for(var i=0; i<s_siblings.length; i++){
				
				// for the cousin: s_sibling[i] , find the contribution due to it's children
				var cousin_children= [];
				
				for(var j=0; j<services_children[s_siblings[i]].length; j++){
					cousin_children.push(services_children[s_siblings[i]][j][KEY_CHILDREN_NAME]);
				}
				
				console.log("cousin_children ",cousin_children); 
				if(cousin_children.length!=0){
					for (var j=0; j<cousin_children.length; j++){
						cousins_ra_re+= (services_owr[cousin_children[j]]*services_tv[cousin_children[j]]);
						cousins_tv+= services_tv[cousin_children[j]];
					}
				}
			}
		}
		// The contribution from the children of the current 'ele' (node)
		// i.e. the siblings 
		for(var i=0; i<s_children.length; i++){
			console.log("services owr ",services_owr[s_children[i]]);
			console.log("services tv ",services_tv[s_children[i]]);
			siblings_ra_re+= (services_owr[s_children[i]]*services_tv[s_children[i]]);
			siblings_tv+= services_tv[s_children[i]];
		} 
		console.log("siblings_ra_re : ", siblings_ra_re);
		console.log("siblings_tv : ", siblings_tv);
		
		// Combining the contribution with appropriate weights
		s_uwr_children= ( (gamma1*siblings_ra_re) +(gamma2*cousins_ra_re));
		s_uwr_children/= ( (gamma1*siblings_tv) +(gamma2*cousins_tv));
		
		console.log("s_uwr_children is : \n"); 
		console.log(s_uwr_children);
		
		for(var i=0; i<s_children.length; i++){
			services_uwr[s_children[i]]=s_uwr_children;
		} 
	}
	else {
		console.log("it has no children");
	}
	
	// Update UWR of the current service element(node) in the database
	clln.update(
		{"name":ele}, 
		{
			$set:{
				"universe_wmean_rating":s_uwr,
			}
		},
		function (err, numUpdated){
			if(err)callback(err);
			else if (numUpdated!=0){
				console.log("updating uwr values ");
				callback(null, numUpdated); 
			}
		}
	);
	
}

// Final task (same in all the examples)
function onBFTraversalComplete(cb) { 
	cb(null,'Done updating'); 
}

// A simple async bfTraversal:
function bfTraversal(clln, element, traversalStep, cb) {
  if(element) {
	traversalStep( clln, element, function(err, result) {
	  if(err){
		cb(err);
	  }
	  else if (result!=null){
		  console.log( "Records updated : ", result);
		  return bfTraversal(clln, queue.shift(),traversalStep, cb);
	  }
	});
  } else {
	return onBFTraversalComplete(cb);
  }
}
			
function updateTvAndOwr(clln, cb){
	
	console.log(" In function updateTvAndOwr : now finding one doc \n\n");
			
	getJsonObjectByNameFromDB(clln, "meta",  function (err, result){
		if(err)cb(err);
		else if (result!=null){
			service_root = result.root;
			console.log("the root is ", service_root);
			console.log("\n the metadata is \n");					
			console.log(result);
			
			// do bfs from (root) and then do a reverse bfs  
			//bfs(queue, 

			queue.push(service_root);
			bfTraversal(clln, queue.shift(), bfTraversalStep, function(err, result){
				if(err)cb(err);
				else if(result!=null){
					cb(null,result);
				}
			});
			
			// Async task corresponding to a breadth first traversal
			// Read a service , update it's trust votes and own weighted rating
			// and at last append it's children services to the queue
			
			// TODO: Also check out that keys are not working when used in form of constants
			
		}
	});
}
function updateOtherScores(clln, cb){
	console.log('In function updateOtherScores: ');
	console.log(element_list);
	console.log(services_children);
	console.log(services_siblings);
	console.log(services_owr);
	console.log(services_tv);
	queue=[];
	for(var i=0; i<element_list.length; i++){
		queue.push(element_list[i]);
	}
	console.log(queue);
	bfTraversal(clln, queue.shift(), uwrCalcStep, function (err,result){
		if(err)cb(err);
		else if(result!=null){
			console.log("Updated uwr ratings for the tree");
			//cb(result);
			// update other scores - initialise queue and define another traversal step for that
			cb(null, 'other scores are updated');
		}
	});	
	
	
}

// TODO: aggregate feedback from the last saved point 

function aggregateFeedbackFromStart(clln, cb){
	console.log('In function aggregateFeedbackFromStart: ');
	updateTvAndOwr(clln, function(err, result){
		if(err)cb(err);
		else if (result!=null){
			
			console.log(result);
			
			// update u_x and other scores for all other services
			updateOtherScores(clln, function(err, result){
				if(err)cb(err);
				else if (result!=null){
					
					cb(null, result);
				}
			});
				
		}
	});
}
//------------------
mongoClient.connect(url, function(err, db){
	if(err) console.log("there was an error: " ,err);
	else {
				
		console.log("connection esatblished to url ",url);
		var clln = db.collection("services");
		
		onConnectionEstablished(clln, function(err, result){
			if(err)console.log(err);
			else if (result!=null){
				
				console.log(result); // intermediate result
				aggregateFeedbackFromStart(clln, function(err, result){
					if(err)console.log(err);
					else if (result!=null){
						
						console.log(result);
						
						db.close();
					}
				});
				
					
			}
		});
		
	}		
});
