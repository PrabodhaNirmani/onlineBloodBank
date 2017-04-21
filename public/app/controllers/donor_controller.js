angular.module('donorCtrl',['donorServices'])

.controller('regDonation',function($location,$timeout,Donor,DonorStore){



	var app=this;
	
	
	app.today=new Date;
	app.donorData=false;
	app.districts=[];
	

	Donor.getDistricts().then(function(msg){
		for(var i=0;i<25;i=i+1){
			app.districts.push(msg.data.districts[i].district)
		}
		
	});

	this.registerDonor=function(regData,valid){
		app.errorMsgReg=false;
		app.loadingReg=true;
		
		if(valid){

			Donor.createDonor(app.regData).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {

						app.loadingReg=false;
						app.successMsgReg=msg.data.message+'.... Loading...';
						$timeout(function(){
							app.regData="";
							DonorStore.setDonor(msg.data.BloodDonor._id);
						
							$location.path('/new-donation');		

							app.successMsgReg=false;
					
						
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

	

	this.donationSearch=function(regData,valid){
		app.errorMsg=false;
		app.loading=true;
		// app.searching=false;
		app.successMsg=false;
		if(valid){
			Donor.search(app.regData).then(function(msg){
				if(msg.data.success){
					
					$timeout(function(){
						app.loading=false;
						app.successMsg=msg.data.message;
						DonorStore.setDonor(msg.data.BloodDonor._id);
					
						
						$timeout(function(){
							
							$location.path('/new-donation');	
							// app.searching=true;
							app.successMsg=false;
						
						
						},2000); 
						
					},1000);
				
				}
				else{
					app.loading=false;
					app.errorMsg=msg.data.message;
					$timeout(function(){
						$location.path('/register-donor');	
						// app.data="";
						app.successMsg=false;
					},2000); 
				}
			}); 
		}
		else{
			app.loading=false;
			app.errorMsg="Please make sure the form is submitted properly"; 
		}

	}
	
	

	this.checkEmail=function(regData){
		app.checkingEmail=true;
		app.emailMsg=false;
		app.emailInvalid=false;

		Donor.checkEmail(app.regData).then(function(response){
			
			if(response.data.success){
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=false;

			}
			else{
			
				app.checkingEmail=false;
				app.emailMsg=response.data.message;
				app.emailInvalid=true;

			}

		})

	}

})

.controller('searchDonorCtrl',function($location,$timeout,Donor,DonorStore){

	app=this;
	app.donorData=null;
	app.searchDonor=function(searchData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.searched=false;
		if(valid){
			Donor.search(app.searchData).then(function(msg){
				if(msg.data.success){
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Loading...';
						app.donorData=msg.data.BloodDonor;
						DonorStore.setDonor(app.donorData._id);
						app.searched=true;
						
						
					}, 1000);
				}
				else{
					app.loading=false;
					app.errorMsg=msg.data.message+'... Please wait...';
					$timeout(function(){
						app.searchData="";
						$location.path('/register-donor');	
						
						app.successMsgReg=false;
					},2000); 
				}
			}); 
		}
		else{
			app.loading=false;
			app.errorMsg="Please make sure the form is submitted properly"; 
		}
	}


})

.controller('donationCtrl',function($location,$timeout,Donor,DonorStore){

	app=this;

	Donor.getDonorDetails().then(function(msg){
		
		if(msg.data.success){
			app.donorData=msg.data.BloodDonor;
					
		}
		else{
			app.donorData=null;
		}
	});

	

	app.donate=function(donorData,valid){
		app.errorMsg=false;
		app.loading=true;
		
		app.successMsg=false;
		if(valid){
			Donor.update(app.donorData).then(function(msg){
				if(msg.data.success){
					$timeout(function() {
						
						app.successMsg=msg.data.message;
						
						app.loading=false;
						$timeout(function(){
							app.regData="";
							DonorStore.setDonor();
							$location.path('/about');
							
						},3000);
					}, 1000);
				}
				else{
					app.loading=false;
					app.errorMsg=msg.data.message;
					$timeout(function(){
						app.successMsg=false;
					},2000); 
				}
			}); 
		}
		else{
			app.loading=false;
			app.errorMsg="Please make sure the form is submitted properly"; 
		}

	}
	
})

.controller('profileCtrl',function($location,$timeout,Donor,DonorStore){

	app=this;

	Donor.getDonorDetails().then(function(msg){
		
		if(msg.data.success){
			app.donorData=msg.data.BloodDonor;
					
		}
		else{
			app.donorData=null;
		}
	});

	
	

	app.edit=function(donorData,valid){
		app.errorMsg=false;
		app.loading=true;
		
		app.successMsg=false;
		if(valid){
			
		}
		else{
			app.loading=false;
			app.errorMsg="Please make sure the form is submitted properly"; 
		}

	}
	
});




