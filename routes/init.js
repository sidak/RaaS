var express = require('express');
var mongodb =require('mongodb');
var mongoClient = mongodb.MongoClient;
CLLN_NAME="services";
META = "meta";
 
// connection url - where our mongodb server is running
var url = 'mongodb://localhost:27017/raas';

// Initialises the database and the collection and
// inserts the metadata into the collection
exports.initialise = function (req, res, next){
	var reqRoot = req.body.root;
	mongoClient.connect(url, function (err, db){
	if(err)console.log(err);
	else {
		express.request.db=express.response.db=db;
		var clln = db.collection(CLLN_NAME);
		var metadata={ 
					name:META,						
					root:reqRoot,
				};
		clln.insert(metadata, function (err,result){
			if(err)console.log(err);
			else if (result!=null){
				console.log(result);
				next();
			}
		});	
		
		}
	});
}
exports.initialiseFromFile = function( req, res){
	var db= req.db;
	var clln = db.collection(CLLN_NAME);
	var fileName= req.fileName;
	var filePath= "../sample_data/";
	filePath+=fileName;
	var serviceData = require(filePath);
	clln.insert(serviceData, function(err, result){
		if(err)cb(err);
		else {
			cb(null, 'Results of insertion are \n'+result);
					
		}
	});
}
