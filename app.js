const express = require('express')
const bodyParser = require("body-parser");
const elasticsearch = require('elasticsearch');

const app = express()
const port = 3000

let client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
	'/',
	(req, res) => {
		let parameters = handleParameters(req);
		client.index(
			{
				index: parameters.source,
				type: 'posts',
				body: {
					userId : parameters.userId,
					clientId : parameters.clientId,
					requireClass : parameters.class,
					requireMethod : parameters.method,
					requireParameter : parameters.parameter,
					verb : parameters.verb,
					route : parameters.route,
					hashId : parameters.hashId,
					message : parameters.message,
					server : parameters.server,
					userAgent : parameters.userAgent,
					date : parameters.date,
					email : parameters.email,
				}

			},
			function(err, resp, status) {
				//console.log(resp);
			}

		);
		res.send('sdsdsHello World!')
	}
)

const handleParameters = (req) => {
	if (req.body.date === '' ) {
		req.body.date = new Date()
	}
	return {
		userId : req.body.userId || null,
		clientId : req.body.clientId || null,
		source : req.body.source || null,
		requireClass : req.body.class || null,
		requireMethod : req.body.method || null,
		requireParameter : req.body.parameter || null,
		verb : req.body.verb || null,
		route : req.body.route || null,
		hashId : req.body.hashId || null,
		message : req.body.message || null,
		server : req.body.server || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		userAgent : req.body.userAgent ||  req.headers['user-agent'] || req.connection.remoteAddress,
		date : new Date(req.body.date) || new Date(),
		email : req.body.email,
	}
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
