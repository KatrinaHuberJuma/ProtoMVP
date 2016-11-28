/* The purpose of the server:
	Is a RESTful API that interacts with database as required.
	What: RESTAPI is, generally, a server, to which clients provide:
		Headers: authTokens, etc (eg, cors !) whatever params
		URL: server, api-name, end-point (latter ==> controllers here), url args (?x=y)
		Verb: Get, Put, Post, Delete
		Request: JSON for Post/Put (not used for get) --what client supplies
		Response: JSON string (perhaps arrays of nested objects)
	How: Implementation of a RESTful API - Many techniques - node, spring, etc... here Node (express)
		app.js starts it off, configures etc
		routes ties end-points to controllers ('wiring')
		controllers functions that do whatever is required to return JSON, often by calling
		models to interact with the data
	Notes
		use npm install to get dependencies (per package.json)
		use nodemon to start server
		use npm test to test it (or, Postman)
 */


console.log("app.js alive");
console.log("app.js getting express");
var express = require('express');
// express is a "Fast, unopinionated, minimalist web framework for Node.js" 
// module/function


console.log("app.js getting db");
var db = require('./db');
console.log("app.js got db");
// server/db/index.js uses mysql to create a connection to the database

var cors = require('cors');
// allows cross site scripting---eliminates the "preflight" header access error



// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');
// router uses methods defined in server/controllers/index.js 
// to tell node express what server/controllers/index methods should be called, 
// depending on what the endpoints are 


var app = express();
// app is the result of invoking the express function
module.exports.app = app;
app.use(cors());

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Set up our routes
app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



console.log("app.js starting to listen....");

app.get('*', function(req, res) {
        res.sendfile('./client/index.html'); 
        // load the single view file 
        // (angular will handle the page changes on the front-end)
    });

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

