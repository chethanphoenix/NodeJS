var express = require('express');
var bodyparser = require('body-parser');

var app = express();
var port = 3000;

// var todos = require('./routes/todos');

// app.use('/v1/api/', todos);
var todos = require('./routes/todos');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use('/api', todos);

app.listen(port, function(){
    console.log('Server is started on the port: ' + port);
});


