angular.module('bloodServices',[])

.factory('Blood',function($http,BloodID){
	bloodFactory={};

	bloodFactory.search=function(data){

		return $http.post('/api/search-blood',data);
	}

	bloodFactory.releaseBlood=function(id){
		
		return $http.post('/api/release-blood/'+id);
	}

	bloodFactory.releaseBloodRequest=function(){
		return $http.put('/api/release-blood/'+BloodID.getId())
	}
	
	

	return bloodFactory;
})



.factory('BloodID',function($window){
	bloodIDFactory={};

	
	bloodIDFactory.setId=function(id){
		if(id){
			$window.localStorage.setItem('id',id);	
		}
		else{
			$window.localStorage.removeItem('id');
		}
		
	}
	
	bloodIDFactory.getId=function(){
		return $window.localStorage.getItem('id');
	}
	return bloodIDFactory;
});


