angular.module('bloodServices',[])

.factory('Blood',function($http){
	bloodFactory={};

	bloodFactory.search=function(data){
		return $http.post('/api/search-blood',data);
	}

	return bloodFactory;
});
