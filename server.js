var express=require('express');
var app=express();
var port=process.env.PORT||8080
var morgan=require('morgan');
var cors=require('cors')
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var router=express.Router();
var mobileRouter=express.Router();
var appRoutes=require('./app/routes/api')(router);
var mobileRoutes=require('./app/routes/api-mobile')(mobileRouter);
var path=require('path');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded    
app.use(express.static(__dirname + '/public'));
app.use(cors())
app.use('/api',appRoutes);
app.use('/api-mobile',mobileRoutes);

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://prabodha:7894511@onlinebloodbank-shard-00-00.jusc3.mongodb.net:27017,onlinebloodbank-shard-00-01.jusc3.mongodb.net:27017,onlinebloodbank-shard-00-02.jusc3.mongodb.net:27017/online-blood-bank?ssl=true&replicaSet=atlas-azsr26-shard-0&authSource=admin&retryWrites=true&w=majority', function(err){
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

//starting the server and listening on port 8080
app.listen(port, function(){
	console.log('running the server on port '+ port);
});
