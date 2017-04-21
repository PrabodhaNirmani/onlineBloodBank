angular.module('donorServices',[])

.factory('Donor',function($http,DonorStore){
	donorFactory={};

	bloodDonor=null;
	search=false;

	donorFactory.createDonor=function(data){
		
		return $http.post('/api/create-donor',data);
	}
	
	donorFactory.search=function(data){
		return $http.post('/api/search-donor',data);
	}

	donorFactory.update=function(data){
		return $http.post('/api/donate-blood',data);
	}

	donorFactory.checkEmail=function(data){
		return $http.post('/api/check-donor-email',data);
	}


	donorFactory.getDistricts=function(){
		return $http.get('/api/get-districts');
	}

	donorFactory.getDonorDetails=function(){
		return $http.get('/api/get-donor/'+DonorStore.getDonor());
	}

	return donorFactory;
})



.factory('DonorStore',function($window){
	donorIDFactory={};

	
	donorIDFactory.setDonor=function(id){

		if(id){
			$window.localStorage.setItem('id',id);	
			
		}
		else{
			$window.localStorage.removeItem('id');
		}
		
	}
	
	donorIDFactory.getDonor=function(){
		return $window.localStorage.getItem('id');
	}
	return donorIDFactory;
});
