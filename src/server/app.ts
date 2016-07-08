'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 4000;

app.use(express.static('./dist/client/'));

app.get('/', function (req, res) {
  res.send(`<html><head>
  	<link rel="stylesheet" href="css/site.css"/>
  	<script src="app.js"></script>
  	</head><body>Hello World!!! 12345ZZZzzzz****!!! ;) ##$ Sergey Pugachev</body></html>`);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port} !`);
});