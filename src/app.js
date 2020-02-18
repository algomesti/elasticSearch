const express = require('express')
const bodyParser = require("body-parser");
const elasticsearch = require('elasticsearch');
const bunyan = require('bunyan');

require('dotenv').config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
})

const app = express()
const port = 3001

const log = bunyan.createLogger({
    name: process.env.APP_NAME,
    streams: [{
        type: process.env.LOG_TYPE,
        path: process.env.LOG_PATH,
        period: process.env.LOG_PERIOD,
        count: parseInt(process.env.LOG_COUNT)
    }]
});


const client = new elasticsearch.Client({
   hosts: [ `http://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`]
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
	'/',
	(req, res) => {
		client.index(
			{
				index: 'stack_operand',
				type: 'posts',
				body: handleParameters(req)
			},
			function(err, resp, status) {
				if (err) {
					log.error(err)
				}
			}

		);
		res.json({
			status: 'success',
			message: `Log to be sent to ElasticSeach at http://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
			index: req.body.source,
			data: handleParameters(req)
		})
	}
)

const handleParameters = (req) => {

	if (req.body.date === '' ) {
		req.body.date = new Date()
	}
	return {
		userId : req.body.userId || null,
		clientId : req.body.clientId || null,
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
