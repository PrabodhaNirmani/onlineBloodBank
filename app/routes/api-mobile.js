var MobileUser=require('../models/mobile_user');
var BloodDonor=require('../models/blood_donor');
module.exports=function(mobileRouter){

	mobileRouter.post('sign-up-donor',function(req,res){
		var email=req.body.email;
		BloodDonor.findOne({email:email}).select({email}).exec(function(err,donor){
			if(err){
				res.json({success:false,message:err})
			}
			else if(!donor){
				res.json({success:false,message:"Blood donor not registered"})	

			}
			else{
				var user=new MobileUser();
				user.email=req.body.email;
				user.username=req.body.username;
				user.password=req.body.password;
				user.role="donor";
				if(req.body.password==req.body.cpassword){
					user.save(function(err){
						if(err){
							
							res.json({success: false,message:err})
						}
						else{
							res.json({success: true,message:"You have successfully created your account"});
						}
						
					});	
				}

			}
		});

	});

	mobileRouter.get('test',function(req,res){
		console.log("herre");
		res.json({success:true,message:"done"})
	});
	
	return mobileRouter;

}