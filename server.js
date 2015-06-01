var express = require('express');
var app = express();

var PORT = 3000;

app.use('/', express.static(__dirname));
app.listen(PORT, function() {
    
    console.log('ClassScore card app running at http://localhost:3000/')
});