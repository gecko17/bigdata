var os = require('os')
var express = require('express')
var app = express()
var mysql = require('mysql');

// https://github.com/3rd-Eden/memcached
var Memcached = require('memcached');

//Connect to the memcached instances
var memcached = new Memcached(['memcached_1:11211', 'memcached_2:11211', 'memcached_3:11211']);

function send_response(response, data) {
	response.send('Hello World! from ' + os.hostname() + '@ ' + new Date() + ", result is: " + data);
}

app.set('port', (process.env.PORT || 5000))

app.get('/person/:id', function (request, response) {
	let userid = request.params["id"];
	let key = 'user_' + userid;

	try {

		//Try to find the data in the cache first
		memcached.get(key, function (err, data) {
			//Cache miss -> load from myssl and cache it
			if (!data) {
				console.log("Cache miss");

				//Connect to the data base -> expensive operation
				var connection = mysql.createConnection({
					host: 'db',
					user: 'root',
					password: 'mysecretpw',
					database: 'sportsdb'
				});
				connection.connect();

				//Run the DB query
				let query = 'SELECT birth_date from persons WHERE person_key = ' + connection.escape(userid) + ' LIMIT 1';
				console.log("Running query", query)
				connection.query(query, function (error, results, fields) {
					console.log("Done, results:", results, error, fields)
					connection.end();
					//If result have been obtained, cache it and send answer to the client
					if (results) {
						data = results[0].birth_date;
						console.log("Query result obtained: ", data);
						memcached.set(key, data, 30 /* seconds */, function (err) { });
						send_response(response, data);
					} else {
						send_response(response, "No data found");
					}
				});


			} else {
				//Cache hit, send answer directly
				console.log("Cache hit");
				send_response(response, data);
			}
		});

	} catch (err) {
		send_response(response, "Error occured", err);
	}
})

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})
