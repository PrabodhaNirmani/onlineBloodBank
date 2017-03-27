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

	return userFactory;
});
