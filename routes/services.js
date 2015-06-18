var ObjectId = require('mongodb').ObjectID;

// ------------------------------------------------
var db;
var clln;

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
					"consumer_feedback_count":0,
					"rating_trust_value":0,
					"trust_votes":0,
					"children":[],
					"parent":[parent]
			}
	return obj;
}
function onParentUpdated(clln, parent, name,cb){
	
	var new_child = createNewServiceObject(parent, name);
	
	clln.insert(new_child, function(err, result){
		if(err)cb(err);
		else {
			cb(null, 'Results of insertion are \n'+result);
		}
	});
	
}
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
				onParentUpdated(clln, parent,name, function(err, result){
					if(err)cb(err);
					else if (result!=null){
						
						var parent_children = services_children[parent];
						var num_parent_children = parent_children.length;
						for(var i=0; i<num_parent_children; i++){
							services_siblings[parent_children[i][KEY_CHILDREN_NAME]].push(name);
						}
						
						services_children[name]=[];
						services_siblings[name]=[];
						for(var i=0; i<num_parent_children; i++){
							services_siblings[name].push(parent_children[i][KEY_CHILDREN_NAME]);
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
	var reqEdgeWt= req.body.edgeWt;
	
	// There are chances that it may not work
	// since it's global variables may not be in memory
	
	addChildService(clln, reqParent, reqName, reqEdgeWt , function (err, result){
		if(err){
			res.send("there was an error in adding service");
		}
		else if (result!=null){
			var id = result[0]._id;
			serviceId[reqName]=id;
			res.send("child service "+ reqName +" and id "+ id+" successfully added");
		}
	});
};


exports.findAllServices= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	clln.find(function (err, result){
		if(err){
			res.send("there was an error in finding all service");
		}
		else if (result!=null){
			console.log("found all services");
			res.send(result);
		}
	});
};

exports.deleteAllServices= function (req, res){
	db = req.db;
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
			res.send("found the requested service"+result);
		}
	}); 
};
exports.updateServiceById= function (req, res){
	
};
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


// given id of the service and the rating and relevance by the user  
exports.addReviewForService= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	
	var reqId= req.body.id;
	var reqRating= req.body.rating;
	var reqRelevance= req.body.relevance;
	
	clln.update(
		{_id: new ObjectId(reqId)}, 
		{
			$push:{
				"consumer_rating":reqRating,
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
exports.getAllReviewsForService= function (req, res){
	db = req.db;
	clln= db.collection(CLLN_NAME);
	var reqId = req.params.id;
	clln.find(
			{_id: new ObjectId(reqId)},
			{ "consumer_ratings":1, "consumer_relevance":1 } 
			// remove double quotes if it does not work
			
			function (err, result){
				if(err){
					res.send("there was an error in finding all the reviews for the service");
				}
				else if (result!=null){
					console.log("found all services");
					res.send(result);
				}
			}
	
	);
};

exports.deleteAllReviewsForService= function (req, res){
	
};
