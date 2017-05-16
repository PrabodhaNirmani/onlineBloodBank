var User=require('../models/user');
var Donation=require('../models/donation');
var StaffMember=require('../models/staff_member');
var BloodDonor=require('../models/blood_donor');
var BloodPacket=require('../models/blood_packet');
var District=require('../models/district');
var DonationCampaign=require('../models/donation_campaign');
var EmergencyRequest=require('../models/emergency_request');


var jwt = require('jsonwebtoken');
var secret='redjohn';


var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var emailExistence = require('email-existence');

module.exports=function(router){


	//my account details of sendgrid
	var options = {
	  auth: {
	    api_user: 'ariyarathna',
	    api_key: 'azone@2221421'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));


	//route login user
	//http://localhost:port/api/authenticate
	router.post('/authenticate',function(req,res){
		User.findOne({username:req.body.username}).select('username password email role active').exec(function(err,user){ 
			
			if(err) {
				res.json({success:false, message:"Counld not authenticate user",forgetUsername:true});
			
				
			}
			else{
				if(!user){
				
					res.json({success:false, message:"Counld not authenticate user",forgetUsername:true});
				} 
				else if(user){
			  		if(req.body.password){
			  			var validPassword=user.comparePassword(req.body.password);
			  		}
			  		else{
			  			res.json({success:false,message:"No password provided"});
			  		}
					if(!validPassword){
						res.json({success:false,message:"Counld not authenticate password",forgetPassword:true});

					}else if(!user.active){
						res.json({success:false,message:"Account is not yet activated. Please check your email for activation link",expired:true});
					}else{
						var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '1h' });
						res.json({success:true,message:"User authenticated successfully",token:token});
					}
				}
			}
			
		});

		
	});

	router.get('/donation-campaigns',function(req,res){
		DonationCampaign.find().select().exec(function(err,campaigns){
			if(err){
				res.json({success:false,message:"Operation failed"});
			}
			else if(campaigns.length<1){
				res.json({success:false,message:"No donation campaign events created"});	
			}
			else{
				res.json({success:true,campaigns:campaigns});		
			}

		});

	});
	
	
	router.get('/emergency-requests',function(req,res){
		EmergencyRequest.find().select().exec(function(err,requests){
			if(err){
				res.json({success:false,message:"Operation failed"});
			}
			else if(requests.length<1){
				res.json({success:false,message:"No emergency request events created"});	
			}
			else{
				res.json({success:true,requests:requests});		
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
					// console.log(req.body.email)
					emailExistence.check(req.body.email, function(err,response){
						if(response){
							res.json({success:true, message:"Valid e-mail"});
						}
						else{
							//sending non exixtance of the mail box
							res.json({success:false,message:"Mailbox does not exist for the given email address"});

						}
		       
		   			});
					
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
					emailExistence.check(req.body.email, function(err,response){
						if(response){
							res.json({success:true, message:"Valid e-mail"});
						}
						else{
							//sending non exixtance of the mail box
							res.json({success:false,message:"Mailbox does not exist for the given email address"});

						}
		       
		   			});
					
				} 
				else if(user){
			  		res.json({success:false, message:"E-mail already exists"});	
				}
			}		
		});		
	});

	router.put('/activate/:token',function(req,res){
		StaffMember.findOne({temporyToken:req.params.token}).select('email').exec(function(err,user){
			if(err) throw err;
			var token=req.params.token;
			jwt.verify(token, secret, function(err, decoded) {
				if(err){
					res.json({success:false,message:"Activation link has expired   ",active:false});
					// console.log(err)
				}
				else if(!user){
					// console.log(user);
					res.json({success:false,message:"User already activated   ",active:true});	
				}
				else{
					res.json({success:true,message:"Fill the form and register",email:user.email});		

				}
			});

		});


	});

	router.post('/save-staff',function(req,res){
		var user=new User();
		user.email=req.body.email;
		user.username=req.body.username;
		user.password=req.body.password;
		user.role="staff";
		// user.temporyToken=null;
		user.active=true;
		console.log(user);
		if(req.body.username==null||req.body.username==''|| req.body.password==null||req.body.password==''||req.body.passwordC==null||req.body.passwordC==''){
			
			res.json({success: false,message:"Ensure that Username and password provided"})
		}
		else if(req.body.password!=req.body.passwordC){
			res.json({success: false,message:"Password and confirm password did not match"})
		}
		else
		{	
			//creating user
			user.save(function(err){
				if(err){
					
					res.json({success: false,message:err})
				}
				else{
					StaffMember.findOne({email:user.email}).select('name temporyToken active').exec(function(err,staff){
						if(err){

						}
						else{
							staff.temporyToken=null;
							staff.active=true;
							staff.save();
							user.name=staff.name;
							user.save();
						}
					});
					var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '1h' });
					res.json({success:true,message:"User authenticated successfully",token:token});
					
				}
				
			});		
	 
		}

	})
	

	//route for the requesting activation link again
	router.post('/resend',function(req,res){
	
		StaffMember.findOne({email:req.body.email}).select('name email temporyToken active').exec(function(err,staff){ 
			
			if(err) {
			
				// return handleError(err);
			}
			else{
				if(!staff){
				
					res.json({success:false, message:"This email address does not belongs to staff member"});
				} 
				else if(staff){
			  		if(staff.active==true){
			  			res.json({success:false,message:"Accound is already activated"});
			  			
			  		}
			  		
			  		else{
			  			var sendLink=function(){
			  				//creating new tempory token for 1 day
			  				staff.temporyToken=jwt.sign({email:staff.email},secret,{ expiresIn: '1d' });
							staff.active=false;
			
							//safa the token

							staff.save(function(error){
						
								if(error){
							
									res.json({success: false,message:"Email or username already exists"})	
							
								}
								else{
									//email object for the requesting email
									var email = {
									  from: 'onlinebloodbanksrilanka@gmail.com',
									  to: staff.email,
									  subject: 'Activation link request',
									  text: 'Hello '+staff.name+'. You have recently request for activation link for your account of ONLINE BLOOD BANK for staff member access. You can activate your account using this link : https://onlinebloodbank.herokuapp.com/activate. Thank You!!!',
									  html: 'Hello '+staff.name+'. You have recently request for activation link for your account of ONLINE BLOOD BANK for staff member access. You can activate your account using this link : <a href="https://onlinebloodbank.herokuapp.com/activate/'+staff.temporyToken+'">https://onlinebloodbank.herokuapp.com/activate</a><br><br><br>Thank You!!!'
									};

									//sending the email
									client.sendMail(email, function(err, info){
									    if (err ){
									      console.log(err);
									    }
									    else {
									    	//sending the sucess message
									    	res.json({success: true,message:"Activation link sent to "+staff.email});		
											console.log('Message sent: ' + info);
									    }
									});							
								}
							});

			  			}

			  			if(staff.temporyToken!=null){
				  			jwt.verify(staff.temporyToken, secret, function(err, decoded) {
								if(err){
									sendLink();
								}
								else{
									res.json({success:false,message:"Activation link already sent to "+staff.email});
								}
							});
			  			

			  			}
			  			else{
			  				sendLink()
			  			}

			  			
						
			  			
			  		}		
				}
			}			
		});
		
	});

	//route to send username to the email : forgot username
	router.get('/reset-username/:email',function(req,res){
		//find user from the email 
		User.findOne({email:req.params.email}).select().exec(function(err,user){
			if(err){
				res.json({success:false,message:err});
			}
			else if(!user){
				res.json({success:false,message:"This email is not registreed"})
			}
			else{
				//email object
				var email = {
				  from: 'onlinebloodbanksrilanka@gmail.com',
				  to: user.email,
				  subject: 'Username request',
				  text: 'Hello... You have recently request for username of your account. Username : ' +user.username+'Thank You!!!',
				  html: 'Hello... You have recently request for username of your account. <br><br>Username : '+user.username+'<br><br>Thank You!!!'
				};

				//sending the email
				client.sendMail(email, function(err, info){
				    if (err ){
				      console.log(err);
				    }
				    else {
				    	//sending the sucess message
						res.json({success:true,message:"Username has been sent to the email! "});
						console.log('Message sent: ' + info);
				    }
				});							


			}
		})
	});


	//route to send reset password link to the email
	router.put('/reset-password',function(req,res){
		//finde user using username
		User.findOne({username:req.body.username}).select().exec(function(err,user){
			if(err){
				res.json({success:false,message:err});
			}
			else if(!user){
				res.json({success:false,message:"Username not found"});
			}
			else{
				var sendPasswordLink=function(){
					//create password reset link for 30 minitues
					user.resetToken=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '30m' });
					user.save(function(error){
						if(error){
							res.json({success:false,message:error});
						}
						else{
							//email object
							var email = {
							  from: 'onlinebloodbanksrilanka@gmail.com',
							  to: user.email,
							  subject: 'Password reset request',
							  text: 'Hello... You have recently request for reset password of your account. You can use this link to reset your password : https://onlinebloodbank.herokuapp.com/reset-password<br>',
							  html: 'Hello... You have recently request for reset password of your account. <br><br>You can use this link to reset your password  : <a href="https://onlinebloodbank.herokuapp.com/reset-password/'+user.resetToken+'">https://onlinebloodbank.herokuapp.com/reset-password</a><br><br><br>Thank You!!!'
							};

							//sending the email
							client.sendMail(email, function(err, info){
							    if (err ){
							      console.log(err);
							    }
							    else {
							    	//sending the sucess message
									res.json({success:true,message:"Password reset link has been sent to the email! "});
									console.log('Message sent: ' + info);
							    }
							});			
							
						}
					});
									

				}

				if(user.resetToken!=null){
				
		  			jwt.verify(user.resetToken, secret, function(err, decoded) {
						if(err){
							sendPasswordLink();
						}
						else{
							
							res.json({success:true,message:"Password reset link has already been sent to "+user.email});
						}
					});
	  			

	  			}
	  			else{
	  				sendPasswordLink()
	  			}
				
				

			}
		})

	});

	//checking the token is valid
	router.get('/reset-password/:token',function(req,res){
		User.findOne({resetToken:req.params.token}).select().exec(function(err,user){
			if(err) throw err;

			var token=req.params.token;

			jwt.verify(token, secret, function(err, decoded) {
				if(err){
					res.json({success:false,message:"Password reset link has been expired.   "});
				}
				else if(!user){
					res.json({success:false,message:"Password reset link has been expired.   "});
				}
				else{
					res.json({success:true,user:user});

				}
			});
			
		});

	});

	//reseting the password
	router.post('/reset-password',function(req,res){
		User.findOne({username:req.body.username}).select().exec(function(err,user){
			if(err){
				res.json({success:false,message:err});
			}
			else{
				var password=req.body.password;
				var passwordC=req.body.passwordC;

				if(password!=passwordC){
					res.json({success:false,message:"Password and confirm password did not match"});
				}
				else{
					user.password=password;
					user.resetToken=null;
					var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '1h' });
					user.save(function(error){
						if (error) {
							res.json({success:false,message:error});
						}
						else{
							res.json({success:true,message:"Password has been reset successfully",token:token});
						}
					});
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
	router.get('/renewToken/:username',function(req,res){
	
		User.findOne({username:req.params.username}).select().exec(function(err,user){
			console.log(user);
			if(err) throw err;
			if(!user){
	
				res.json({success:false,message:"No user was found"});
			}
			else{
				// var token=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '5m' });

				var newToken=jwt.sign({username:user.username,role:user.role,email:user.email},secret,{ expiresIn: '1h' });
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
		// user.temporyToken=null;
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
		staff.temporyToken=jwt.sign({email:staff.email},secret,{ expiresIn: '2d' });
		staff.active=false;
		
		if(req.body.email==null||req.body.email==''||req.body.name==null||req.body.name=='' || req.body.tele_no==null||req.body.tele_no==''){
			
			res.json({success: false,message:"Ensure that all fields are provided"})
		}
		else
		{
			
			
			//cheking the existance of the email given
			emailExistence.check(staff.email, function(err,response){
				if(response){
					//creating user
					User.findOne({email:staff.email}).select().exec(function(err,u){
						if(err){
							res.json({success: false,message:"Operation failed"});	
						}
						else if(u){
							res.json({success: false,message:"Email already exists"});
						}
						else{
							staff.save(function(error){
								console.log(staff
									)
										if(error){
											// console.log("here")
											console.log(error)
											res.json({success: false,message:"Email already exists"});
									
										}
										else{
									
											var email = {
											  from: 'onlinebloodbanksrilanka@gmail.com',
											  to: staff.email,
											  subject: 'Loging details to the ONLINE BLOOD BANK',
											  text: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. You can activate your account using this link : https://onlinebloodbank.herokuapp.com/activate. Thank You!!!',
											  html: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. You can activate your account using this link : <a href="https://onlinebloodbank.herokuapp.com/activate/'+staff.temporyToken+'">https://onlinebloodbank.herokuapp.com/activate</a><br><br><br>Thank You!!!'
											};


											client.sendMail(email, function(err, info){
											    if (err ){
											      console.log(err);
											    }
											    else {
											    	res.json({success: true,message:"Staff Member created successfully"});		
													console.log('Message sent: ' + info);
											    }
											});							
								
										}
							});							
						}
					})

				}
				else{
					res.json({success:false,message:"Mailbox does not exist for the given email address"});

				}
		       
		    });
			 
			
		}
	});
	
	//route to get check password with curent password

	router.post('/check-password',function(req,res){
		
		var password=req.body.current;

		var token=req.body.token||req.body.query||req.headers['x-access-token']; 
		
		
		if(token){
			// verify a token
			jwt.verify(token, secret, function(e, decoded) {
				if(e){
					res.json({success:false,message:"Token invalid"});
				}
				else{
					var username=decoded.username;
					User.findOne({username:username}).select().exec(function(err,user){
						if(err){
							res.json({success:false,message:err});
						}
						else if(!user){
							res.json({success:false,message:"No user found"});	

						}
						else if(password){
							var validPassword=user.comparePassword(password);

							if(!validPassword){
								res.json({success:false,message:"Current password did not match"});

							}else{
							
								res.json({success:true,message:"Current password is matched"});
							}
				

						}
						else{
							//res.json({success:false,message:"No password provided"});								
						}
					});
				}
			});
		}
		else{
			res.json({success:false,message:"No token provided"})
		}
	

	});
	

	router.post('/change-password',function(req,res){

		var token=req.body.token||req.body.query||req.headers['x-access-token']; 
		
		
		if(token){
			// verify a token
			jwt.verify(token, secret, function(e, decoded) {
				if(e){
					res.json({success:false,message:"Token invalid"});
				}
				else{
					var username=decoded.username;

					User.findOne({username:username}).select().exec(function(err,user){
						if(err){
							res.json({success:false,message:err});
						}
						else if(!user){
							res.json({success:false,message:"No user found"});	

						}
						else {
							if(user.comparePassword(req.body.current)){
								if(req.body.password==req.body.passwordC){
									user.password=req.body.password;
									user.save(function(error){
										if (error){
											res.json({success:false,message:error});	

										}
										else{
											res.json({success:true,message:"Password reset successfully"});											
										}
									});
								}
								else{
									res.json({success:false,message:"Password and confirm password did not match"});
								}	
							}
							else{
								res.json({success:false,message:"Current password did not match"});
							}
							
							
						}
					});
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
			donor.district=req.body.district;
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

		BloodDonor.findOne({email:req.body.email}).select('_id name email abo rh gender').exec(function(err,donor){ 
			
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

	

	router.get('/get-donor/:id',function(req,res){
		BloodDonor.findOne({_id:req.params.id}).select().exec(function(err,donor){ 
			
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
														console.log(err)
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
			
			var abo=bloodGroup[0]+bloodGroup[1];	//spliting abo value
			var rh=bloodGroup[2];		//spliting rh factor
		}
		else if(bloodGroup.length==2){
			var abo=bloodGroup[0];		//spliting abo value
			var rh=bloodGroup[1];	//spliting rh factor
		}
		//finding blood which are not expried and not released
		BloodPacket.find({abo:abo,rh:rh,release_status:false,expire_status:false}).select('blood_packet_id abo rh donated_date expiration_date').exec(function(err,bloodList){ 
			
			if(err) {
				console.log("err")
			}
			else{
				if(bloodList.length==0){
			
					res.json({success:false, message:"No blood packets found"});
				} 
				else if(bloodList.length>0){
					for(var i=0;i<bloodList.length;i++){
						if(bloodList[i].expiration_date<new Date()){
							var blood=bloodList[i];
							blood.expire_status=true;
							blood.save();

						}
						
					}
					BloodPacket.find({abo:abo,rh:rh,release_status:false,expire_status:false}).select('blood_packet_id abo rh donated_date expiration_date').exec(function(error,newBloodList){ 
			
						if(error) {
							console.log("error")
						}
						else{
							if(newBloodList.length==0){
						
								res.json({success:false, message:"No blood packets found"});
							} 
							else if(newBloodList.length>0){
								
								res.json({success:true,message:"Blood is available",BloodPacket:newBloodList});
							}
						}
					});
					
				}
			}
		});
	});


	//releasing blood packets
	router.post('/release-blood/:id',function(req,res){
		var id=req.params.id;

		BloodPacket.findOne({_id:id}).select().exec(function(err,blood){
			if(err){
				console.log("expried err");
			}
			else if(!blood){
				console.log("blood list length 0");
			}
			else{
			
				blood.release_status=true;
				blood.release_date=new Date();
				blood.save(function(err){
					if(err){
						res.json({success:false, message:"Error occured"});
					}
					else{
						res.json({success:true, message:"Blood packet released"});	
					}
				});
				

				
			
			}
		});

	});


	//finding blood packets to release
	router.put('/release-blood/:id',function(req,res){
		var id=req.params.id;
		BloodPacket.findOne({_id:id}).select().exec(function(err,blood){
			if(err){
				res.json({success:false});

			}
			else if(!blood){
				res.json({success:false});
			}
			else{
				res.json({success:true,blood:blood});
			}
		});
	});

	router.get('/get-blood-expirations',function(req,res){
		BloodPacket.find({expire_status:true}).select().exec(function(err,bloodList){
			if(err) throw err;
			if(bloodList.length==0){
				res.json({sucess:false,message:"No blood packets"})
			}
			else{
				res.json({success:true,message:"Blood packets have been expired",blood:bloodList})
			}
		});
	});

	router.get('/get-blood-releases',function(req,res){
		BloodPacket.find({release_status:true}).select().exec(function(err,bloodList){
			if(err) throw err;
			if(bloodList.length==0){
				res.json({sucess:false,message:"No blood packets"})
			}
			else{
				res.json({success:true,message:"Blood packets have been released",blood:bloodList})
			}
		});
	});


	router.get('/get-user-details/:username',function(req,res){
		var username=req.params.username;
		User.findOne({username:username}).select().exec(function(err,user){
			if(err){
				res.json({success:false});

			}
			else if(!user){
				res.json({sucess:false});
			}
			else{
				res.json({success:true,User:user})
			}
		});
	});

	router.put('/edit',function(req,res){
		console.log(req.decoded.username)
		
		if(req.body.name) var newName=req.body.name;
		if(req.body.email) var newEmail=req.body.email;
		User.findOne({username:req.decoded.username},function(err,user){
			if(err){
				throw err;
			}
			else if(!user){
				res.json({success:false,message:"no User provided"})
			}
			else{
				if(newName){
					user.name=newName;
					user.save(function(err){
						if(err){
							throw err;
						}
						else{
							res.json({success:true,message:"Name has been updated successfully"});
						}
					})
				}
				else if(newEmail){
					user.email=newEmail;
					user.save(function(err){
						if(err){
							throw err;
						}
						else{
							res.json({success:true,message:"Email has been updated successfully"});
						}
					})
				}
			}
		});
	});

	// route to get ditricts list in Sri Lanka
	router.get('/get-districts',function(req,res){
		District.find({valid:true}).select('district').exec(function(err,list){
			if(err){
				console.log("err");

			}
			else{
				res.json({districts:list});
			}
		})

	});	

	//route to expires blood from the system
	router.put('/expire-blood',function(req,res){
		
		BloodPacket.find({expire_status:false,release_status:false}).select().exec(function(err,bloodList){
			
			if(err) throw err;

			if(!bloodList){
				console.log('het')
			}
			else{
				for(var i=0;i<bloodList.length;i++){
					if(bloodList[i].expiration_date<new Date()){
						var blood=bloodList[i];
						blood.expire_status=true;
						blood.save();

					}
					
				}	
			}

			
		});
	});

	router.put('/remove-emergenct-requests',function(req,res){
		var request_id=req.body._id;
		EmergencyRequest.find({_id:request_id}).select().exec(function(err,request){
			
			if(err) throw err;

			if(!request){
				res.json({success:false})
			}
			else{
				request.active=false;
				request.save(function(err){
					if(err){
						res.json({success:false})
					}
					else{
						res.json({success:true})
					}
				})
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

