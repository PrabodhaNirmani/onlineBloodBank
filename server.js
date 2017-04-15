var express=require('express');
var app=express();
var port=process.env.PORT||8080
var morgan=require('morgan');
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
var path=require('path');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded    
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

// 'mongodb://127.0.0.1:27017/online_blood_bank',
//connect to the database

// mongodb://user:user@ds147480.mlab.com:47480/testblood
//mongodb://prabodha:prabodha@ds147080.mlab.com:47080/blood-bank
mongoose.connect('mongodb://prabodha:prabodha@ds147080.mlab.com:47080/blood-bank', function(err){
	if(err){
		console.log('Not connected to db');
		console.log(err);

	}
	else{
		console.log('connected');
	}
});

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
})

//starting the server and listening on pora 8080
app.listen(port, function(){
	console.log('running the server on port '+ port);
});