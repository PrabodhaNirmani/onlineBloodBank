var User=require('../models/user');
var Donation=require('../models/donation');
var BloodDonor=require('../models/blood_donor');
var BloodPacket=require('../models/blood_packet');
var jwt = require('jsonwebtoken');
var secret='redjohn';

var StaffMember=require('../models/staff_member');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var emailExistence = require('email-existence');

module.exports=function(router){


	//my account details of sendgrid
	var options = {
	  auth: {
	    api_user: 'prabodha',
	    api_key: 'prabodha@1994'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));


	//route login user
	//http://localhost:port/api/authenticate
	router.post('/authenticate',function(req,res){
		User.findOne({username:req.body.username}).select('username password email role').exec(function(err,user){ 
			
			if(err) {
			
				// return handleError(err);
			}
			else{
				if(!user){
				
					res.json({success:false, message:"Counld not authenticate user"+user});
				} 
				else if(user){
			  		if(req.body.password){
			  			var validPassword=user.comparePassword(req.body.password);
			  		}
			  		else{
			  			res.json({success:false,message:"No password provided"});
			  		}
					if(!validPassword){
						res.json({success:false,message:"Counld not authenticate password"});

					}else{
						var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '1h' });
						res.json({success:true,message:"User authenticated successfully",token:token});
					}
				}
			}
			
		});

		
	});


	//http://localhost:port/api/check-email
	router.post('/check-email',function(req,res){
		User.findOne({email:req.body.email}).select('email').exec(function(err,user){ 
			
			if(err) {
		
				// return handleError(err);
			}
			else{
				if(!user){	
					res.json({success:true, message:"Valid e-mail"});
				} 
				else if(user){
			  		res.json({success:false, message:"E-mail already exists"});	
				}
			}		
		});		
	});
	//username
	router.post('/check-username',function(req,res){
		User.findOne({username:req.body.username}).select('username').exec(function(err,user){ 
			
			if(err) {
			
				// return handleError(err);
			}
			else{
				if(!user){	
					res.json({success:true, message:"Valid username"});
				} 
				else if(user){
			  		res.json({success:false, message:"Username already exists"});	
				}
			}		
		});		
	});

	//http://localhost:port/api/check-email
	router.post('/check-donor-email',function(req,res){
		
		BloodDonor.findOne({email:req.body.email}).select('email').exec(function(err,user){ 
			
			if(err) {
			
				// return handleError(err);
			}
			else{
				if(!user){	
					res.json({success:true, message:"Valid e-mail"});
				} 
				else if(user){
			  		res.json({success:false, message:"E-mail already exists"});	
				}
			}		
		});		
	});

	//middleware
	router.use(function(req,res,next){
		var token=req.body.token||req.body.query||req.headers['x-access-token']; 
		if(token){
			// verify a token
			jwt.verify(token, secret, function(err, decoded) {
				if(err){
					res.json({success:false,message:"Token invalid"});
				}
				else{
					req.decoded=decoded;
					
					next();
				}
			});
		}
		else{
			res.json({success:false,message:"No token provided"})
		}
	});

	router.post('/me',function(req,res){
		
		res.send(req.decoded); 

	});

	//renew token for the user's request
	router.get('/renewToken/:usename',function(req,res){
		User.findOne({username:req.params.username}).select().exec(function(err,user){
			if(err) throw err;
			if(!user){
				res.json({success:false,message:"No user was found"});
			}
			else{
				var newToken=jwt.sign({username:user.username},secret,{ expiresIn: '1h' });
				res.json({success:true,token:newToken});
			}
		});
	});
	
	//route register admin
	router.post('/users',function(req,res){
		var user=new User();
		user.email=req.body.email;
		user.username=req.body.username;
		user.password=req.body.password;
		user.role="admin";
		//user.temporyToken=null;
		user.active=true;
		
		if(req.body.username==null||req.body.username==''|| req.body.password==null||req.body.password==''||req.body.email==null||req.body.email==''||req.body.passwordC==null||req.body.passwordC==''){
			
			res.json({success: false,message:"Ensure that name, username, teleno, email and password provided"})
		}
		else if(req.body.password!=req.body.passwordC){
			res.json({success: false,message:"Password and confirm password did not match"})
		}
		else
		{	
			//check existance of the mail box for the given email address
			emailExistence.check(user.email, function(err,response){
				if(response){
					//creating user
					user.save(function(err){
						if(err){
							
							res.json({success: false,message:err})
						}
						else{
							res.json({success: true,message:"User created successfully"});
						}
						
					});		
				}
				else{
					//sending non exixtance of the mail box
					res.json({success:false,message:"Mailbox does not exist for the given email address"});

				}
		       
		    });
			 
		}
	});

	//route register staff
	router.post('/staff',function(req,res){
		var staff=new StaffMember();
		staff.name=req.body.name;
		
		staff.tele_no=req.body.tele_no;
		staff.email=req.body.email;
		
		
		if(req.body.email==null||req.body.email==''||req.body.name==null||req.body.name=='' || req.body.tele_no==null||req.body.tele_no==''){
			
			res.json({success: false,message:"Ensure that all fields are provided"})
		}
		else
		{
			//password generate function
			var randomString = function(length) {
			    var text = "";
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			    for(var i = 0; i < length; i++) {
			        text += possible.charAt(Math.floor(Math.random() * possible.length));
			    }
			    return text;
			}
			var password=randomString(10);
			//creating user

			var user=new User();
			user.email=staff.email;
			user.password=password;
			user.username=user.email;
			user.role="staff";
			//user.temporyToken=var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '2d' });
			//cheking the existance of the email given
			emailExistence.check(user.email, function(err,response){
				if(response){
					//creating user
					user.save(function(err){
						if(err){
							
							res.json({success: false,message:"Email or username already exists"})
						}
						else{
							
							//creating staff member
							staff.save(function(error){
								if(error){
									res.json({success: false,message:"Email or username already exists"})

								}
								else{
									//sending email  to the staff member with login details
									var email = {
									  from: 'Localhost staff,bloodbank@localhost.com',
									  to: user.email,
									  subject: 'Loging details to the ONLINE BLOOD BANK',
									  text: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. This e-mail contains login details to the system. Username :'+user.username+'Password : '+password+'You can activate your account using this link : http://localhost:8080/login. Thank You!!!',
									  html: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. This e-mail contains login details to the system.<br><br><b>Username : </b>'+user.username+'<br><b>Password : </b>'+password+'<br><br><br>You can activate your account using this link : <a href="http://localhost:8080/login">http://localhost:8080/login.</a><br><br><br>Thank You!!!'
									};

									client.sendMail(email, function(err, info){
									    if (err ){
									      console.log(error);
									    }
									    else {
									    	res.json({success: true,message:"Staff Member created successfully"});		
											console.log('Message sent: ' + info);
									    }
									});							
								}
							});
							
						}
						
					}); 	
				}
				else{
					res.json({success:false,message:"Mailbox does not exist for the given email address"});

				}
		       
		    });
			 
			
		}
	});
	

	//route for register donor
	router.post('/create-donor',function(req,res){
		
		
		var donor=new BloodDonor();
		donor.name=req.body.name;
		donor.nic_no=req.body.nic_no;
		donor.birthday=req.body.birthday;
		
		//calculating age of the donor
		var findAge=function(birthday){
			var today=new Date();
			var age=today.getYear()-birthday.getYear();
			return age;
		};
		donor.age=findAge(donor.birthday);
		//checking the donor is allowed to donate blood
		//age is greater than 18 years
		if(donor.age<18){

			res.json({success:false,message:"Age violation"});

		}
		else{

			donor.gender=req.body.gender;
			donor.address=req.body.address;
			donor.tele_no=req.body.tele_no;
			donor.email=req.body.email;
			donor.abo=req.body.abo;
			donor.rh=req.body.rh;
			donor.donation_count=0;
			
			//cheking the mali box does exist
			emailExistence.check(donor.email, function(err,response){
				if(response){
					//create donor
					donor.save(function(err){
						if(err){
							res.json({success:false,message:"Error occured"});
						}
						else{
							//creatinng email
							// var randomString = function(length) {
							//     var text = "";
							//     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
							//     for(var i = 0; i < length; i++) {
							//         text += possible.charAt(Math.floor(Math.random() * possible.length));
							//     }
							//     return text;
							// }
							// var password=randomString(10);
							// var email = {
							// 	from: 'Localhost staff,bloodbank@localhost.com',
							// 	to: donor.email,
							// 	subject: 'Loging details to the BLOOD DONOR APP',
							// 	text: 'Hello '+donor.name+'. Your account of BLOOD DONOR APP was created. This e-mail contains login details to the system. Username :'+donor.username+'Password : '+password+'',
							// 	html: 'Hello '+donor.name+'. Your account of BLOOD DONOR APP was created. This e-mail contains login details to the system.<br><br><b>Username : </b>'+donor.username+'<br><b>Password : </b>'+password+''
							// };
							// //sending email
							// client.sendMail(email, function(err, info){
							//     if (err ){
							//       console.log(error);
							//     }
							//     else {
							//     	res.json({success:true,message:"Blood donor created successfully",BloodDonor:donor})
							// 		console.log('Message sent: ' + info);
							//     }
							// });
							res.json({success:true,message:"Blood donor created successfully",BloodDonor:donor})
						}

					});
				}
				else{
					res.json({success:false,message:"Mailbox does not exist for the given email address"});

				}
		       
		    });
			

		}

		 
	});

	//route for search blood donor
	router.post('/search-donor',function(req,res){

		BloodDonor.findOne({email:req.body.email}).select('name email abo rh gender').exec(function(err,donor){ 
			
			if(err) {
			
				// return handleError(err);
			}
			else{
				if(!donor){
				
					res.json({success:false, message:"Blood donor is not found, Register first"});
				} 
				else if(donor){

			  		
						res.json({success:true,message:"Donor found",BloodDonor:donor});
					
				}
			}
			
		
		});


	});


	//donate blood
	router.post('/donate-blood',function(req,res){

		BloodDonor.findOne({email:req.body.email}).select('email donation_count last_donated_date').exec(function(err,donor){ 
			
			if(err) {
		
				// return handleError(err);
			}
			else{
				if(!donor){
				
					res.json({success:false, message:"Blood donor is not found, Register first"});
				} 
				else if(donor){


					var tempDate=null;
					var lastDate=donor.last_donated_date;
					var temp=req.body.last_donated_date;
					var newDate=new Date(temp);
					//check the donor is allowed to donate blood, 
					//whether the donors last donation date was four mouns before the new donation date 
					var validDuration=function(){
						if(lastDate==null){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()>0){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()==0 && newDate.getMonth()-lastDate.getMonth()>4){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()==0 && newDate.getMonth()-lastDate.getMonth()==4 && newDate.getDate()-lastDate.getDate()>0){
							return true;
						}
						else{
							tempDate=lastDate;
							tempDate.setMonth(lastDate.getMonth()+4);

							return false;
						}
					}
					
					if(validDuration()){
						BloodDonor.update({_id:donor._id},
			  			{$set:{last_donated_date:req.body.last_donated_date,
			  				donation_count:donor.donation_count+1}},
			  				function(err){
			  					if(err){
			  						
			  						res.json({success:false,message:"err"});

			  					}
			  					else{
			  						var createBlood=function(donor){
			  							var abo=donor.abo;
			  							var rh=donor.rh;
			  							BloodPacket.count({abo:abo,rh:rh}, function(err, c) {
			  								if(err){

			  								}
			  								else{
			  									//creating blood packet
			  									var bloodPacket=new BloodPacket();
			  									var count=c.toString();
			  									//assinging blood packet id
			  									bloodPacket.blood_packet_id=abo+rh+'0'.repeat(8-count.length)+count;
			  									bloodPacket.donated_date=new Date(donor.last_donated_date);
			  									bloodPacket.expiration_date=new Date(donor.last_donated_date);
			  									bloodPacket.expiration_date.setMonth(donor.last_donated_date.getMonth()+1);
			  									bloodPacket.abo=abo;
			  									bloodPacket.rh=rh;
			  									bloodPacket.release_status=false;
			  									bloodPacket.expire_status=false;

			  									bloodPacket.save(function(err,bloodPacket){
													if(err){
														res.json({success:false,message:"Error occured"});
													}
													else{
														var donation=new Donation();
														donation.donor_id=donor._id;
														donation.blood_packet_id=bloodPacket.blood_packet_id;

														donation.save(function(err){
															if(err){

															}
															else{
																res.json({success:true,message:"Donation created successfully"});		
															}
														});	
													}
												});
			  								}
			  							});
			  						}
			  						BloodDonor.findOne({email:donor.email}).select('_id email abo rh last_donated_date').exec(function(err,newDonor){
			  							if(err){

			  							}
			  							else{
			  								createBlood(newDonor);		
			  							}
			  						});
			  					}
			  				});
					}
					else{
						//sending the date for the donor allow to donated blood
						res.json({success:false,message:"This blood donor can not donate blood until "+tempDate});
					}
						
				}
			}
		});
	});

	//route for search blood blood
	router.post('/search-blood',function(req,res){

		var bloodGroup=req.body.group;
		if(bloodGroup.length==3){
			var abo=bloodGroup.subString(0,2);	//spliting abo value
			var rh=bloodGroup[2];		//spliting rh factor
		}
		else if(bloodGroup.length==2){
			var abo=bloodGroup[0];		//spliting abo value
			var rh=bloodGroup[1];	//spliting rh factor
		}
		//finding blood which are not expried and not released
		BloodPacket.find({abo:abo,rh:rh,release_status:false,expire_status:false}).select('blood_packet_id abo rh donated_date expiration_date').exec(function(err,bloodList){ 
			
			if(err) {
			}
			else{
				if(!bloodList){
				
					res.json({success:false, message:"No blood packets found"});
				} 
				else if(bloodList){
					res.json({success:true,message:"Donor found",BloodPacket:bloodList});
				}
			}
		});
	});

	


	//route to root
	router.get('/',function(req,res){
		res.send('helloo... Prabodhaaa');
	});

	//route to home
	router.get('/home',function(req,res){
		res.send('helloo... Prabodhaaa is from home');
	});

	return router;
}

