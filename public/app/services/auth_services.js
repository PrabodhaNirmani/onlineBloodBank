angular.module('authServices',['bloodServices'])


.factory('Auth',function($http,AuthToken,Blood){
	authFactory={};

	authFactory.login=function(loginData){
		
		return $http.post('/api/authenticate',loginData).then(function(data){
			
			AuthToken.setToken(data.data.token);
			return data
		});
	};

	
	
	

	authFactory.resetPassword=function(userData){
		return $http.post('/api/reset-password',userData).then(function(msg){
			AuthToken.setToken(msg.data.token);
			
			return msg
		});
	}

	authFactory.saveUserStaff=function(data){
		return $http.post('api/save-staff',data).then(function(msg){
			AuthToken.setToken(msg.data.token);
			
			return msg
		});
	}
	// Auth.isLoggedIn()
	authFactory.isLoggedIn=function(){
		if(AuthToken.getToken()){
			return true;
		}
		else{
			return false;
		}
   
	};

	// Auth.logout()
	authFactory.logout=function(){

		//removing the token
		AuthToken.setToken();

	};

	// Auth.getUser()
	authFactory.getUser=function($q){
		if(AuthToken.getToken()){
			return $http.post('/api/me');

		}
		else{
			$q.reject({message:"User has no token"});
		}
 
	};

	return authFactory;
})


.factory('AuthToken',function($window){
	authTokenFactory={};

	// AuthToken.setToken(token);
	authTokenFactory.setToken=function(token){
		if(token){
			$window.localStorage.setItem('token',token);	
		}
		else{
			$window.localStorage.removeItem('token');
		}
		
	}
	// AuthToken.getToken(token);
	authTokenFactory.getToken=function(){
		return $window.localStorage.getItem('token');
	}
	return authTokenFactory;
})



.factory('AuthInterceptors',function(AuthToken){
	var authInterceptorsFactory={}

	// AuthInterceptors.request()
	
	authInterceptorsFactory.request=function(config){
		var token=AuthToken.getToken();
		if(token) config.headers['x-access-token']=token;
		return config;
	}

	return  authInterceptorsFactory;

});
