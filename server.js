var express = require('express')
  , http = require('http')
  , app = express();
app.use(express.static(__dirname));
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port);
