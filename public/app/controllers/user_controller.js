angular.module('userCtrl',['userServies'])

.controller('regUser',function($location,$timeout,User){

	var app=this;

	this.registerStaff=function(data,valid){
		app.errorMsg=false;
		app.successMsg=false;
		app.loading=true;

		if(valid){
			User.createStaff(app.data).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message
						
					}, 1000);
		
				}
				else{
					app.loading=false;
					app.errorMsg=msg.data.message; 
				}
			});	
		}
		else{
			app.loading=false;
			app.errorMsg="Please ensure the form is filled out properly"; 
		}
		


	};

	this.registerAdmin=function(data,valid){
		app.errorMsg=false;
		app.loading=true;
		if(valid){

			User.create(app.data).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Redirecting...';
						$timeout(function(){
							$location.path('/about');	
						},1000);
						
					}, 1000);
		
				}
				else{
					app.loading=false;
					app.errorMsg=msg.data.message; 
				}
			});
		}
		else{
			app.loading=false;
			app.errorMsg="Please ensure the form is filled out properly"; 
		}


	};

	this.checkEmail=function(data){
		app.checkingEmail=true;
		app.emailMsg=false;
		app.emailInvalid=true;
		app.wait=true;

		User.checkEmail(app.data).then(function(response){
			
			if(response.data.success){
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=false;
				app.wait=false;

			}
			else{
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=true;
				app.wait=false;

			}

		})


	}

	this.checkUsername=function(data){
		app.checkingUsername=true;
		app.usernameMsg=false;
		app.usernameInvalid=true;
		app.wait=true;

		User.checkUsername(app.data).then(function(response){
			
			if(response.data.success){
			
				app.checkingUsername=false;
				app.usernameMsg=response.data.message;
				app.usernameInvalid=false;
				app.wait=false;

			}
			else{
			
				app.checkingUsername=false;
				app.usernameMsg=response.data.message;
				app.usernameInvalid=true;
				app.wait=false;

			}

		})


	}


})


.controller('userProfileCtrl',function(User,$location,Auth,$routeParams,$scope){
	var app=this;
	$scope.nameTab='active';
	// app.nameTab='active'
	app.phase1=true;
	app.loading=false;
	app.successMsg=false;
	app.errorMsg=false;
	app.userObject={};
	User.getUserDetails($routeParams.username).then(function(data){

		if(data.data.success){
			app.user=data.data.User;
			$scope.newName=app.user.name;
			$scope.newEmail=app.user.email;
			app.userObject.username=app.user.username;
			

		}
		else{
			Auth.logout(); 
			$location.path('/login');	
			

		}
	});

	app.namePhase=function(){
		$scope.nameTab='active'
		$scope.emailTab='default'
		// app.nameTab='active'
		// app.emailTab='default'
		
		app.phase1=true;
		app.phase2=false;
		app.successMsg=false;
		app.errorMsg=false;
	}

	app.emailPhase=function(){
		$scope.nameTab='default'
		$scope.emailTab='active'
		// app.nameTab='default'
		// app.emailTab='active'
		app.phase1=false;
		app.phase2=true;
		app.successMsg=false;
		app.errorMsg=false;
	}

	app.editName=function(newName,valid){
		app.errorMsg=false;
		app.loading=true;
		if(valid){
			app.userObject.name=newName;
			User.editUser(app.userObject).then(function(msg){
				if(msg.data.success){
					app.successMsg=msg.data.message;
					console.log(app.successMsg)

					app.loading=false;
					app.errorMsg=false;
				}
				else{
					app.errorMsg=msg.data.message;
					app.loading=false;
					app.successMsg=false;
				}
			});
		}
		else{
			app.errorMsg="Please ensure the form is filled out properly"

		}
	}

	app.editEmail=function(newEmail,valid){
		app.errorMsg=false;
		app.loading=true;
		if(valid){
			app.userObject.email=newEmail;
			User.editUser(app.userObject).then(function(msg){
				if(msg.data.success){
					app.successMsg=msg.data.message;
					console.log(app.successMsg)

					app.loading=false;
					app.errorMsg=false;
				}
				else{
					app.errorMsg=msg.data.message;
					app.loading=false;
					app.successMsg=false;
				}
			});
		}
		else{
			app.errorMsg="Please ensure the form is filled out properly"

		}
	}

	

	app.checkEmail=function(newEmail){
		app.checkingEmail=true;
		app.emailMsg=false;
		app.emailInvalid=true;
		app.wait=true;

		User.checkEmail({email:newEmail}).then(function(response){
			
			if(response.data.success){
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=false;
				app.wait=false;

			}
			else{
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=true;
				app.wait=false;

			}

		})


	}


});


