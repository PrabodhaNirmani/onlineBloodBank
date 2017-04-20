angular.module('emailCtrl',['userServies','authServices'])

.controller('emailCtrl',function($routeParams,$timeout,User,Auth,$location){

	var app=this;


	this.checkEmail=function(data){
		app.checkingEmail=true;
		app.emailMsg=false;
		app.emailInvalid=false;

		User.checkEmail(app.data).then(function(response){
			
			if(response.data.success){
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=false;

			}
			else{
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=true;

			}

		})


	}

	this.checkUsername=function(data){
		app.checkingUsername=true;
		app.usernameMsg=false;
		app.usernameInvalid=false;

		User.checkUsername(app.data).then(function(response){
			
			if(response.data.success){
			
				app.checkingUsername=false;
				app.usernameMsg=response.data.message;
				app.usernameInvalid=false;

			}
			else{
			
				app.checkingUsername=false;
				app.usernameMsg=response.data.message;
				app.usernameInvalid=true;

			}

		})


	}


	User.activateStaff($routeParams.token).then(function(data){
		app.errormsg=false;
		app.successMsg=false;
		app.saveData={email:null};
		app.disable=false;
		app.active=false;
		
		if(data.data.success){

			app.successMsg=data.data.message;
			app.saveData.email=data.data.email;
			app.disable=true;
			
		}
		else{

			app.errormsg=data.data.message;
			app.active=data.data.active;
			
			
			if(app.active){
				$timeout(function(){
					if(Auth.isLoggedIn()){
						$location.path('/about');
					}
					else{
						$location.path('/login');	
					}
					
				},2000);	
			}
			
		}
	});

	app.saveUser=function(saveData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.expired=false;
		if(valid){
			Auth.saveUserStaff(app.saveData).then(function(msg){
				if(msg.data.success){
						
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Redirecting...';
						$timeout(function(){
							$location.path('/about');	
							app.saveData=null;
							app.successMsg=false;
							//mainCtrl.app.checkSession();
						},1000);
						
					}, 1000);
		
				}
				else{
					if(msg.data.expired){
						app.expired=true;
						app.loading=false;
						app.errorMsg=msg.data.message+"  "; 
					}
					else{
						app.loading=false;
						app.errorMsg=msg.data.message+"  "; 
					}
					
				}

			});
			
		}

		else{
			app.errorMsg="Please ensure the form is filled out properly"
		}
		
		

	}

	
})

.controller('resendCtrl',function(User){

	var app=this;

	app.checkStaffUser=function(data,valid){
		app.errorMsg=false;
		app.successMsg=false;
		
		if(valid){
			console.log(valid)
			console.log(app.data)
			User.checkCredentials(app.data).then(function(msg){
				console.log(msg)
				if(msg.data.success){
				console.log("here")
					app.successMsg=msg.data.message
				
				}
				else{
					
					app.errorMsg=msg.data.message
					console.log(app.errorMsg);
				}


			});	
		}
		else{
			app.errorMsg="Please ensure the form is filled out properly"
		}
		
	}

	app.checkEmail=function(data){
		app.checkingEmail=true;
		app.emailMsg=false;
		app.emailInvalid=false;

		User.checkEmail(app.data).then(function(response){
			
			if(response.data.success){
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=false;

			}
			else{
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=true;

			}

		})


	}

	
})


.controller('passwordCtrl',function(User){

	var app=this;

	app.requestPasswordReset=function(userData,valid,$timeout){
		console.log(app.valid)
		app.errorMsg=false;
		app.successMsg=false;
		app.disable=false;
		app.loading=true;
		
		if(valid){
			
			User.requestPasswordReset(app.userData).then(function(msg){
				
				if(msg.data.success){
					app.disable=true;
					app.successMsg=msg.data.message;
					app.loading=false;

				
				}
				else{
					
							
					app.errorMsg=msg.data.message;
					app.loading=false;
					
				}


			});	
		}
		else{
			app.errorMsg="Please ensure the form is filled out properly"
		}
		
	}

	
})

.controller('usernameCtrl',function(User,$location,$timeout){

	var app=this;

	app.requestUsername=function(data,valid){
		app.errorMsg=false;
		app.successMsg=false;
		app.disable=false;
		
		if(valid){
		
			User.requestUsername(app.data.email).then(function(msg){
				
				if(msg.data.success){
					app.disable=true;
					app.successMsg=msg.data.message;
					$timeout(function(){
						$location.path('/login')
					},2000);
					
				
				}
				else{
					
					app.errorMsg=msg.data.message;
		
				}


			});	
		}
		else{
			app.errorMsg="Please ensure the form is filled out properly";
		}
		
	}

	
})


.controller('resetCtrl',function($routeParams,$timeout,User,Auth,$location){
	var app=this;

	User.resetUser($routeParams.token).then(function(data){
		
		app.errormsg=false;
		app.successMsg=false;
		app.userData={username:null};
		app.hide=false;
		
		
		if(data.data.success){
			
			app.successMsg="Enter new password";
			app.userData.username=data.data.user.username;
			app.hide=true;
		}
		else{
			app.errormsg=data.data.message;	
			
		}
	});

	app.resetPassword=function(userData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.expired=false;
		if(valid){
			Auth.resetPassword(app.userData).then(function(msg){
				if(msg.data.success){
						
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Redirecting...';
						$timeout(function(){
							console.log("err")
							if(Auth.isLoggedIn()){
								$location.path('/about');
							}
							else{
								$location.path('/login');	
							}
							app.userData=null;
							app.successMsg=false;
							//mainCtrl.app.checkSession();
						},1000);
						
					}, 1000);
		
				}
				else{
					if(msg.data.expired){
						app.expired=true;
						app.loading=false;
						app.errorMsg=msg.data.message+"  "; 
					}
					else{
						app.loading=false;
						app.errorMsg=msg.data.message+"  "; 
					}
					
				}

			});
			
		}

		else{
			app.errorMsg="Please ensure the form is filled out properly"
		}
		
	}


})



.controller('changeCtrl',function($routeParams,$timeout,User,Auth,$location){
	var app=this;

	app.checkCurrentPassword=function(userData){
		app.passwordError=true;

		User.compairePassword(app.userData).then(function(data){
			
				app.passwordError=data.data.success;
				app.passwordErrorMsg=data.data.message
			
		});

	}

	

	app.changePassword=function(userData,valid){
		app.errorMsg=false;
		app.loading=true;
		
		if(valid){
			User.changePassword(app.userData).then(function(msg){
				if(msg.data.success){
						
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Redirecting...';
						$timeout(function(){
							
							$location.path('/about');
							
							app.userData=null;
							app.successMsg=false;
							
						},2000);
						
					}, 2000);
		
				}
				else{
					
						app.loading=false;
						app.errorMsg=msg.data.message+"  "; 
				}

			});
			
		}

		else{
			app.errorMsg="Please ensure the form is filled out properly"
		}
		
	}


});



