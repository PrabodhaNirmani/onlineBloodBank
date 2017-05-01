angular.module('userServies',[])

.factory('User',function($http){
	userFactory={};

	userFactory.create=function(data){
		return $http.post('/api/users',data);
	}

	userFactory.createStaff=function(data){
		return $http.post('/api/staff',data);
	}

	userFactory.renewSession=function(username){
		return $http.get('/api/renewToken/'+username);
	}

	//check email
	userFactory.checkEmail=function(data){
		return $http.post('/api/check-email',data);
	}

	//check username
	userFactory.checkUsername=function(data){
		return $http.post('/api/check-username',data);
	}

	userFactory.activateStaff=function(token){
		
		return $http.put('api/activate/'+token);

	}

	userFactory.checkCredentials=function(data){
		return $http.post('api/resend',data);
	}

	userFactory.requestUsername=function(email){
		return $http.get('api/reset-username/'+email);
	}

	userFactory.requestPasswordReset=function(data){
		return $http.put('/api/reset-password',data)
	}

	userFactory.resetUser=function(token){
		return $http.get('/api/reset-password/'+token);
	}

	userFactory.compairePassword=function(data){
		
		return $http.post('/api/check-password/',data);

	}

	userFactory.changePassword=function(userData){
		return $http.post('/api/change-password',userData);
	}

	userFactory.getUserDetails=function(username){
		return $http.get('/api/get-user-details/'+username);

	}

	userFactory.editUser=function(data){
		return $http.put('/api/edit',data);
	}

	

	
	return userFactory;
});



