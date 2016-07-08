'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 4000;

app.get('/', function (req, res) {
  res.send('<html><head></head><body>Hello World!!! ;) ##$ Sergey Pugachev</body></html>');
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port} !`);
});