var express=require('express');
var app=express();
var port=process.env.PORT||8081
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

var District=require('./app/models/district');
var districtList=['Matara','Galle','Hambantota','Colombo','Gampaha','Kaluthara','Monaragala','Badulla','Kandy','Matale','Nuwara Eliya','Ampara','Anuradhapura','Batticaloa','Jaffna','Kegalle','Kilinochchi','Kurunegala','Mannar','Mullaitivu','Polonnaruwa','Puttalam','Rathnapura','Trincomalee','Vavniya'];

mongoose.Promise=global.Promise;
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

//starting the server and listening on pora 8081
app.listen(port, function(){
	console.log('running the server on port '+ port);
});
