var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  host = process.env.HOST || '0.0.0.0',
  bodyParser = require('body-parser');

 //test

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/containerRoute.js');
routes(app);

app.listen(port, host);

console.log('slidenerd-container-api API server started on: ' + port);