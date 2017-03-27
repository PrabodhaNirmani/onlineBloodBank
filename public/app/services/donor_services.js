angular.module('donorServices',[])

.factory('Donor',function($http){
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

	donorFactory.setDonor=function(donor){
		bloodDonor=donor;

	}

	donorFactory.getDonor=function(){
		return bloodDonor;
	}

	donorFactory.getFlag=function(){
		return search;
	}

	donorFactory.setFlag=function(flag){
		search=flag;
	}
	

	return donorFactory;
});
