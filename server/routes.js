var controller = require('./controllers');
// uses methods defined in server/controllers/index.js, therefore require './controllers'

// router tells node express what the endpoints are, and what controllers code should be called

var router = require('express').Router(); // framework for node servers
//.Router is a method from express; configure the router

//Connect controller methods to their corresponding routes

//          endpoint,    name of the method to call
router.get('/foods',   controller.foods.get); // server controllers/index.js foods.get
router.get('/ratings', controller.ratings.get);

router.post('/foods', controller.foods.post);  // TODO - move this up, the world stops spinning... WHY??

// use module.exports to make these router methods available to other files that require this file
module.exports = router;

