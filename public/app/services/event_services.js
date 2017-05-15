angular.module('eventServices',[])

.factory('Event',function($http){
	eventFactory={};

	eventFactory.getDonationCampaigns=function(){
		return $http.get('/api/donation-campaigns');
	}

	eventFactory.getEmergencyRequests=function(){
		return $http.get('/api/emergency-requests');	
	}


	// eventFactory.removeEmergencyRequest=function(data){
	// 	return $http.put('/api/remove-emergenct-requests',data)
	// }

	// eventFactory.getPendingCampaigns=function(){
	// 	return $http.get('/api/pending-donation-campaigns');
	// }
	
		

	return eventFactory;
})

