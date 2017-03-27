angular.module('bloodCtrl',['bloodServices'])

.controller('bloodCtrl',function($location,$timeout,Blood){

	var app=this;
	// Donor.setFlag(false);
	
	
	this.searchBlood=function(searchData,valid){
		app.errorMsgReg=false;
		app.loadingReg=true;
		app.searching=false;
		app.bloodList={};
		if(valid){

			Blood.search(app.searchData).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {

						app.loadingReg=false;
						app.successMsgReg=msg.data.message+'.... Loading...';
						$timeout(function(){
							
							//$location.path('/update-donor');
							app.bloodList=msg.data.BloodPacket;
							console.log(app.bloodList)
							// Donor.setDonor(msg.data.BloodDonor);	
							// app.donorData=Donor.getDonor();
							app.successMsgReg=false;
							//app.searching=true;
							// Donor.setFlag(true);
							// app.searching=Donor.getFlag();
						
						},1000);
						
					}, 1000);
		
				}
				else{
					app.loadingReg=false;
					app.errorMsgReg=msg.data.message; 
				}
			}); 
		}
		else{
			app.loadingReg=false;
			app.errorMsgReg="Please make sure the form is submitted properly"; 
		}
	}
});

