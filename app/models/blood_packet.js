
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BloodPacketSchema=new Schema({
  blood_packet_id:{type:String, required:true},
  abo:{type:String, required:true},
  rh:{type:String,required:true},
  expiration_date:{type:Date,required:true,default:null},
  donated_date:{type:Date,required:true,default:null},
  release_status:{type:Boolean,required:true},
  expire_status:{type:Boolean,required:true,default:null}

});



module.exports=mongoose.model('BloodPacket',BloodPacketSchema);