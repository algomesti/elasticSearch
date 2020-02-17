const express = require('express')
const bodyParser = require("body-parser");
const elasticsearch = require('elasticsearch');


require('dotenv').config({
  path: process.env.NODE_ENV.toLowerCase() === "production" ? ".env.production" : ".env"
})

const app = express()
const port = 3001

let client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
	'/',
	(req, res) => {
		console.log('ENV: ', process.env.NODE_ENV)
		console.log('PORT: ', process.env.APP_PORT)
		let parameters = handleParameters(req);
		client.index(
			{
				index: req.body.source,
				type: 'posts',
				body: handleParameters(req)
			},
			function(err, resp, status) {
				console.log('ERRO: ', err);
				console.log('RESP: ', resp);
				console.log('STAT: ', status);
			}

		);
		res.send('fim')
	}
)

const handleParameters = (req) => {

	if (req.body.date === '' ) {
		req.body.date = new Date()
	}
	return {
		userId : req.body.userId || null,
		action : req.body.action || null,
		jsonChangedFields : req.body.jsonChangedFields|| null,
		table : req.body.table|| null,
		primaryKeyId : req.body.primaryKeyId|| null,
		sessionHash : req.body.sessionHash|| null,
		operationHash : req.body.operationHash|| null,
		url : req.body.url|| null,
		urlParameters : req.body.urlParameters|| null,
		createdAt : new Date(req.body.createdAt)|| new Date(),
		source : req.body.source || 'generic' ,
	}
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
