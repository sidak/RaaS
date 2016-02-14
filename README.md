# Rating as a Service (RaaS) Architecture

##Description
This project provides a *REST API* for consumer Rating as a Service (*RaaS*) architecture, facilitating feedback aggregation in Service Ecosystem. It is written using *Node.js* and *Express* with *MongoDB* for persistance. 

*RaaS* is a building block service that can be used to add the consumer feedback lifecycle feature in the development of various web platforms.

This API was written during my research work on the topic, **Relevance calculation of reviews in Service-Oriented Architecture**. This research was carried out as a part of my **Research Internship at Purdue University, USA**. 

It is based on the general architecture proposed in the paper - "Hierarchical Aggregation of Consumer Ratings for Service Ecosystem". The authors for the same being : Rohit Ranchal, Ajay Mohindra, Nianjun Zhou, Shubir Kapoor and Bharat Bhargava. 

##Endpoints

###Service Resources

- `GET` services
- `GET` services/:id
- `GET` services/:id/reviews
- `POST` services
- `POST` services/:id/reviews
- `DELETE` services
- `DELETE` services/:id

###Feedback Resources

- `GET` feedback
- `GET` feedback/:id

###Init Method

- `GET` init/:fileName
- `POST` init

## Steps to get started 

- Installing MongoDB
- Installing Node and NPM
- Running the API 
- Playing with the API

### Installing MongoDB

### Installing Node and NPM

### Running the API

```
sudo service mongod start
npm rebuild
node bin/www
```
### Playing with the API

Install Postman extension. Then experiment with different GET, POST, DELETE commands

```
GET http://localhost:3000/api/init/dataFile.js
GET http://localhost:3000/api/feedback
GET http://localhost:3000/api/services
```


