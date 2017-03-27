 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z]+$/
  })
];

var StaffMemberSchema=new Schema({
	
  name:{
    type:String,
    required:true
  
  },
	
  email:{
    type:String,
    lowercase:true,
    required:true,
    unique:true
  },

  tele_no:{
    type:String,
    required:true
  }
});



StaffMemberSchema.plugin(titlize, {
  paths: ['name']
});


module.exports=mongoose.model('StaffMember',StaffMemberSchema);