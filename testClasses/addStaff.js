var User=require('../app/models/user');
var StaffMember=require('../app/models/staff_member');
var jwt = require('jsonwebtoken');
var secret='redjohn';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var emailExistence = require('email-existence');


module.exports=function(email,name,tele_no) {
	// function to test adding staff member funciton
	
	//my account details of sendgrid
	var options = {
	  auth: {
	    api_user: 'nirmani',
	    api_key: 'prabodha@1994'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));

	var staff=new StaffMember();
	staff.name=name;
	
	staff.tele_no=tele_no;
	staff.email=email;
	staff.temporyToken=jwt.sign({email:staff.email},secret,{ expiresIn: '2d' });
	staff.active=false;

	//cheking the existance of the email given
	emailExistence.check(staff.email, function(err,response){
		if(response){
			//creating user
			User.findOne({email:staff.email}).select().exec(function(err,u){
				if(err){
					return false;
				}
				else if(user){
					return false;
				}
				else{
					staff.save(function(error){
						
						if(error){
							return false;
						}
						else{
							// var email = {
							//   from: 'onlinebloodbanksrilanka@gmail.com',
							//   to: staff.email,
							//   subject: 'Loging details to the ONLINE BLOOD BANK',
							//   text: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. You can activate your account using this link : https://onlinebloodbank.herokuapp.com/activate. Thank You!!!',
							//   html: 'Hello '+staff.name+'. Your account of ONLINE BLOOD BANK for staff member access was created. You can activate your account using this link : <a href="https://onlinebloodbank.herokuapp.com/activate/'+staff.temporyToken+'">https://onlinebloodbank.herokuapp.com/activate</a><br><br><br>Thank You!!!'
							// };

							// client.sendMail(email, function(err, info){
							//     if (err ){
							//       	return false;
							//     }
							//     else {
							//     	return true;		
							//     }
							// });		
							return true;								
						}
					});							
				}
			})

		}
		else
		{
			return false;

		}
       
    });
	 
	


	
}
