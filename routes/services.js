var ObjectId = require('mongodb').ObjectID;

// ------------------------------------------------
var db;
var clln;

// GLOBAL VARIABLES ----------------------------
services_id={};
element_list=[];				
service_root="";
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

alpha = 0.5;
gamma1 = 0.75; 
// for siblings
gamma2 = 0.25; 
// for cousins

//---------------------- CONSTANTS---------------

KEY_NAME="name";
KEY_ARS="agg_rating_score";
KEY_ORC="own_rating_cont";
KEY_CRC="children_rating_cont";
KEY_OWR="own_wmean_rating";
KEY_UWR="universe_wmean_rating";
KEY_CRa="consumer_ratings";
KEY_CRe="consumer_relevance";
KEY_RD="review_dates";
KEY_CFCt="consumer_feedback_count";
KEY_RTV="rating_trust_value";
KEY_TV="trust_votes";
KEY_RR= "reviewerRanking";	
KEY_CHILDREN="children";
KEY_SIBLINGS="siblings";
KEY_PARENT="parent";
KEY_CHILDREN_NAME="name";
KEY_CHILDREN_WT="wt";


//--------------------- helper methods

// it assumes that connection has been established
function getJsonObjectByNameFromDB(clln, name, cb){
	var myCursor = clln.find({"name":name});
	myCursor.limit(1);			
	myCursor.each(function(err,result){
		if(err)cb(err);
		else if(result!=null){
			cb("", result);
		}
	});
}
function getJsonObjectByIdFromDB(clln, id, cb){
	var myCursor = clln.find({_id:new ObjectId(id)});
	myCursor.limit(1);			
	myCursor.each(function(err,result){
		if(err)cb(err);
		else if(result!=null){
			cb(null, result);
		}
	});
}

function createNewServiceObject(parent, name){
	var obj = {
					"name":name,
					"agg_rating_score":0,
					"own_rating_cont":0,
					"children_rating_cont":0,
					"own_wmean_rating":0,						
					"universe_wmean_rating":0,
					"consumer_ratings":[],
					"consumer_relevance":[],
					"reviewer_ranking":[],
					"consumer_feedback_count":0,
					"rating_trust_value":0,
					"trust_votes":0,
					"children":[],
					"parent":[parent]
			}
	return obj;
}
function oPU(clln, parent, name,cb){
	
	var new_child = createNewServiceObject(parent, name);
	
	clln.insert(new_child, function(err, result){
		if(err)cb(err);
		else {
			console.log("done propely");
			cb(null, result);
		}
	});
	
}
exports.onParentUpdated=oPU;

function addChildService(clln, parent, name, edge_wt, cb ){	
	
	// update the parent's children array with the name and the edge wt of child
	// in the database
	// update the local service_childen object for the parent and also init to [] for the new one
	// update the local service_siblings object for the new element and for it's siblings
	clln.update(
		{"name":parent}, 
		{
			$push:{
				"children":{
					"name":name,
					"wt":edge_wt
				}
			}
		},
		function (err, numUpdated){
			if(err)cb(err);
			else if (numUpdated!=0){
				
				// create a new json object and insert into the collection
				oPU(clln, parent,name, function(err, result){
					if(err)cb(err);
					else if (result!=null){
						console.log(services_children);
						var parent_children = services_children[parent];
						
						services_children[name]=[];
						services_siblings[name]=[];
						console.log(services_children[parent]);
						if(services_children[parent]!==undefined){
							var num_parent_children = parent_children.length;
							for(var i=0; i<num_parent_children; i++){
								services_siblings[parent_children[i][KEY_CHILDREN_NAME]].push(name);
							}
							
							for(var i=0; i<num_parent_children; i++){
								services_siblings[name].push(parent_children[i][KEY_CHILDREN_NAME]);
							}
							console.log("shit happend");
						}
						else {
							console.log("services_children for parent is initialised to []");
							services_children[parent]=[];
						}
						services_children[parent].push({"name":name, "wt":edge_wt});
						services_ars[name]=0;
						services_owr[name]=0;
						services_rtv[name]=0;
						services_tv[name]=0;
						services_uwr[name]=0;
						console.log(services_children);
						cb(null, result);
					}
				});
			}
		}
	);
	
} 

// the addService method is used to add a child service to a 
// parent service corresponding to a HTTP Post request. for adding the root the initialise() 
// in the init.js route will be used. 

exports.addService= function (req, res){
	db = req.db;
	// if it does not work, use "services" for the clln name
	clln= db.collection(CLLN_NAME);
	var reqParent = req.body.parent;
	var reqName= req.body.name;
	var reqEdgeWt= parseFloat(req.body.edgeWt);
	
	// There are chances that it may not work
	// since it's global variables may not be in memory
	
	addChildService(clln, reqParent, reqName, reqEdgeWt , function (err, result){
		if(err){
			res.send("there was an error in adding service");
		}
		else if (result!=null){
			var id = result["ops"][0]["_id"];
			services_id[reqName]=id;
			res.send("child service "+ reqName +" and id "+ id+" successfully added");
			console.log(id);
		}
	});
};


// This needs to be fixed. It returns a lot of data 
// but not the services data
exports.findAllServices= function (req, res){
	
	db = req.db;
	clln= db.collection(CLLN_NAME);
	var cursor = clln.find();
	var ans="";
	console.log("in find all services");
	cursor.each(function(err,result){
		if(err) ans+=("there was an error : ");
		else if(result!=null){
			
			console.log(result);
			var doc = JSON.stringify(result);
			console.log("it's a stringified");
			console.log(doc);
			ans += doc;
			console.log("outputting ans");
			console.log(ans);
			ans+='\n';
			
		}
		else if(result===null){
				console.log("hello");
				res.set('Content-Type', 'text/html');
				res.send(ans);
		}
	});
};
// It works well
exports.deleteAllServices= function (req, res){
	db = req.db;
	console.log(CLLN_NAME);
	console.log(db);
	clln= db.collection(CLLN_NAME);
	clln.remove({}, function (err, result){
		if(err){
			res.send("there was an error in deleting all the services: "+err);
		}
		else if (result!=null){
			console.log("successfully deleted all the services");
			res.send("successfully deleted all the services" +result);
		}
	});
};
//It works well
exports.findServiceById= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	var id = req.params.id;
	// it converts the id into ObjectId object internally
	getJsonObjectByIdFromDB( clln,id, function(err, result){
		if(err){
			res.send("there was an error in finding service of id : "+id);
		}
		else if (result!=null){
			console.log("found the requested service");
			res.send(result);
		}
	}); 
};
// It works well 
exports.deleteServiceById= function (req, res){
	
	db = req.db;
	clln= db.collection(CLLN_NAME);
	var reqId = req.params.id;
	// it converts the id into ObjectId object internally
	clln.remove( {_id: new ObjectId(reqId)}, function(err, result){
		if(err){
			res.send("there was an error in deleting service of id : "+reqId);
		}
		else if (result!=null){
			console.log("deleted the requested service");
			res.send("deleted the requested service"+result);
		}
	}); 
};

// It works well
// Doesn't add reviewer ratings
// given id of the service and the rating and relevance by the user  
exports.addReviewForService= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	
	var reqId= req.params.id;
	var reqRating= (req.body.rating-'0');
	var reqRelevance= (req.body.relevance-'0');
	
	clln.update(
		{_id: new ObjectId(reqId)}, 
		{
			$push:{
				"consumer_ratings":reqRating,
				"consumer_relevance":reqRelevance
			}
		},
		function (err, numUpdated){
			if(err) res.send ("there was an error "+err);
			else if (numUpdated!=0){
				res.send(" num of records updated "+numUpdated);
			}
		}
	);
	
};
// This works well
exports.getAllReviewsForService= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	var reqId = new ObjectId(req.params.id);
	console.log(req.params.id);
	console.log(reqId);
	var cursor= clln.find(
				{"_id": reqId},
				{ "consumer_ratings":1, "consumer_relevance":1 } // returns the data corresponding to these fields in the document
				);
	cursor.each(
			function (err, result){
				if(err){
					res.send("there was an error in finding all the reviews for the service");
				}
				else if (result!=null){
					console.log("found all reviews for this service");
					console.log(result);
					res.send(result);
				}
			}
	
	);
};
