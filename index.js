'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
mongoose.connect(process.env.MONGOLAB_URI ||
	'mongodb://localhost/restapi/cities');

//app.use(express.static(__dirname + '/build'));

// mongoimport --host localhost --db restapi  --collection cities < mongodata.json

var dbSchema = new mongoose.Schema({
	city: String,
	loc: {
		type: [Number],
		index: '2dsphere'
	},
	pop: Number,
	state: String
});
var cities = mongoose.model('cities', dbSchema);

var routes = function (app) {
	app.use(bodyparser.json());

	app.get('/city', function (req, res) {
		cities.find({}, function (err, data) {
			if (err) return res.status(500)
				.send({
					'msg': 'couldn\'t find any cities'
				});
			res.json(data);
		});
	});

	app.delete('/city/:name', function (req, res) {
		cities.remove({
			city: req.params.name
		}, function (err) {
			if (err) return res.status(500)
				.send({
					'msg': 'couldn\'t delete'
				});

			res.json(req.body);
		});
	});

}
var router = express.Router();
routes(router);
app.use('/api/v1', router);

app.listen(process.env.PORT || 3000, function () {
	console.log('server listening on port ' + (process.env.PORT || 3000));
});