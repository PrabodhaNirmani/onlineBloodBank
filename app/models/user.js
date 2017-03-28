var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');


var UserSchema=new Schema({
	email:{
    type:String,
    lowercase:true,
    required:true,
    unique:true
  },
	username:{
    type:String,
    lowercase:true,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true
  },
	active:{
    type:Boolean,
    default:false,
    required:true
  },
  temporyToken:{
    type:String,
    default:null
  }
  
});

UserSchema.pre('save', function(next) {
  var user=this;
  bcrypt.hash(user.password,null,null,function(err,hash){
  	if(err) return next(err);
  	
  	user.password=hash;
  	next();
  })
  
});




UserSchema.methods.comparePassword=function(password){
  return bcrypt.compareSync(password,this.password);

}



module.exports=mongoose.model('User',UserSchema);