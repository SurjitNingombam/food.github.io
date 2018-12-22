var express = require('express');
var app = express();

app.use(express.static(__dirname + "/app"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(process.env.PORT || 3000);
console.log("Server up on port 3000");