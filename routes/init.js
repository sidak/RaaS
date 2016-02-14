var express = require('express');
var mongodb =require('mongodb');
var mongoClient = mongodb.MongoClient;
CLLN_NAME="services";
META = "meta";
 
// connection url - where our mongodb server is running
var url = 'mongodb://localhost:27017/raas';

function findUnixTimeInMillis(day, month, year){
	var givenDate = new Date(year, month, day);
	return givenDate.getTime();
}

function filterTillTime(timeInMillis, data){
	for(var i=0; i<data.length; i++){
		if(data[i].hasOwnProperty(KEY_CRa)){
			var ratings=[], relevance = [], dates=[];
			for(var j=0; j<data[i][KEY_CRa].length; j++){
				if(data[i][KEY_RD][j]<=timeInMillis){
					ratings.push(data[i][KEY_CRa][j]);
					relevance.push(data[i][KEY_CRe][j]);
					dates.push(data[i][KEY_RD][j]);
				}
			}
			data[i][KEY_CRa] = ratings;
			data[i][KEY_CRe] = relevance;
			data[i][KEY_RD] = dates;
		}
	}
	return data;
}
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
	mongoClient.connect(url, function (err, db){
	if(err)console.log(err);
	else {
		express.request.db=express.response.db=db;
		var clln = db.collection(CLLN_NAME);
		// Now insert the json array of service objects
		var fileName= req.params.fileName;
		// ../ implies go back to previous directory
		var filePath= "../sample_data/";
		filePath+=fileName;

		var serviceData = require(filePath);
		
		clln.insert(serviceData, function(err, result){
			if(err) res.send(err);
			else {
				console.log('Results of insertion are \n');
				res.send(result);
						
			}
		});
		
		}
	});
	
}

exports.filterAndInitialiseFromFile = function(req, res){
	mongoClient.connect(url, function (err, db){
	if(err)console.log(err);
	else {
		express.request.db=express.response.db=db;
		var clln = db.collection(CLLN_NAME);
		// Now insert the json array of service objects
		var fileName= req.params.fileName;
		var day = req.params.day;
		var month = req.params.month;
		var year = req.params.year;
		
		// ../ implies go back to previous directory
		var filePath= "../sample_data/";
		filePath+=fileName;

		var serviceData = require(filePath);
		
		var timeInMillis = findUnixTimeInMillis(day, month, year);
		serviceData = filterTillTime(timeInMillis, serviceData);
	
		clln.insert(serviceData, function(err, result){
			if(err) res.send(err);
			else {
				console.log('Results of insertion are \n');
				res.send(result);
						
			}
		});
		
		}
	});
	
}
