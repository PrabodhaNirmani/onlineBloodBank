angular.module('mainController',['authServices','userServies'])

.controller('mainCtrl',function(Auth,User,AuthToken,$route,$timeout,$window,$location,$rootScope,$interval){
	var app=this;
	app.loadMe=false;
		
	//checking logged users session
	app.checkSession=function(){
		if(Auth.isLoggedIn()){
			app.checkingSession=true;
			var interval=$interval(function(){
				var token=$window.localStorage.getItem('token');
				if(token==null){
					$interval.cancel(interval);
				}
				else{

					self.parseJwt=function(token){
						var base64Url=token.split('.')[1];
						var base64=base64Url.replace('-','+').replace('_','/');
						return JSON.parse($window.atob(base64));
					}
					var expireTime=self.parseJwt(token);
					var timeStamp=Math.floor(Date.now()/1000);
					
					var check=expireTime.exp-timeStamp;
					
					if(check<=25){
						$interval.cancel(interval);
						console.log('token has expired');
						app.showModal(1);
					}
					else{
						console.log('token os still vallid');
					}

				}
			},10000);
		}

	};

	app.checkSession();
	app.showModal=function(option){
		app.choice=false;
		app.modalTitle=undefined;
		app.modalBody=undefined;
		app.hideButton=false;

		if(option===1){
			app.modalTitle='Timeout Warning';
			app.modalBody='Your session will expires within few seconds, Would you like to renew your session';
			
			$("#myModal").modal({backdrop:"static"});
			$timeout(function(){
				if(!app.choice){
					app.hideModal();
					$timeout(function(){
						app.showModal(2);
					},500);
				}
			},6000);

		
		}
		else if(option===2){
			app.hideButton=true;
			app.modalTitle='Logging Out';
			$("#myModal").modal({backdrop:"static"});
			$timeout(function(){
				Auth.logout(); 
				$location.path('/');
				app.hideModal();
				$route.reload()
			
			},4000);
			

		}
		
	}

	app.renewSession=function(){
		app.choice=true;


		User.renewSession(app. username).then(function(data){
			if(data.data.success){
				AuthToken.setToken(data.data.token);
				app.checkSession();

			}
			else{
				app.modalBody=data.data.message;
			}

		});
		app.hideModal();

	}

	app.endSession=function(){
		app.choice=true;

		app.hideModal();
		$timeout(function(){
			app.showModal(2);
		},500);

	}
	
	app.hideModal=function(){
		$("#myModal").modal('hide');


	}


	$rootScope.$on('$routeChangeStart',function(){
		if(!app.checkingSession) app.checkSession();

		if(Auth.isLoggedIn()){
			app.isLoggedIn=true;
			app.loadMe=true;

			Auth.getUser().then(function(data){
				
				app.username=data.data.username;
				app.email=data.data.email;

				app.role=data.data.role;
			});
		}
		else{
			app.isLoggedIn=false;
			app.loadMe=false;
			app.email="";
			app.role="";
			app.username="";
		}
	});

	

	//login function
	this.doLogin=function(loginData,valid){
		app.errorMsg=false;
		app.loading=true;
		if(valid){

			Auth.login(app.loginData).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Redirecting...';
						$timeout(function(){
							$location.path('/about');	
							app.loginData="";
							app.successMsg=false;
							app.checkSession();
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
			app.errorMsg="Please make sure the form is submitted properly"; 
		

		}

	}

	//logout option
	this.logout=function(){
		app.showModal(2);
		
	}

 });


