const express = require('express')
const bodyParser = require("body-parser");
const elasticsearch = require('elasticsearch');

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

		let parameters = handleParameters(req);
		client.index(
			{
				index: req.body.source,
				type: 'posts',
				body: {
					userId : parameters.userId,
					action : parameters.action,
					jsonChangedFields : parameters.jsonChangedFields,
					table : parameters.table,
					primaryKeyId : parameters.primaryKeyId,
					sessionHash : parameters.sessionHash,
					operationHash : parameters.operationHash,
					url : parameters.url,
					urlParameters : parameters.urlParameters,
					createdAt : parameters.createdAt,
				}

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
