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
							$location.path('/');	
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


});

