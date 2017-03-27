
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z]+$/
  })
];

var BloodDonorSchema=new Schema({

	name:{type:String, required:true},
  nic_no:{type:String, required:true, unique:true},
  birthday:{type:Date,required:true},
  gender:{type:String, required:true},
  age:{type:Number, required:true},
  address:{type:String, required:true},
  tele_no:{type:String, required:true},
  email:{type:String, lowercase:true, required:true, unique:true},
  abo:{type:String, required:true},
  rh:{type:String,required:true},
  donation_count:{type:Number,default:0},
  last_donated_date:{type:Date,default:null}
});



BloodDonorSchema.plugin(titlize, {
  paths: ['name']
});


module.exports=mongoose.model('BloodDonor',BloodDonorSchema);