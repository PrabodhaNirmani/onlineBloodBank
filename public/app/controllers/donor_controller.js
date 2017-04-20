angular.module('donorCtrl',['donorServices'])

.controller('regDonation',function($location,$timeout,Donor){



	var app=this;
	// Donor.setFlag(false);
	app.searching=Donor.getFlag();
	app.today=new Date;
	app.donorData=Donor.getDonor();
	app.districts=[];
	

	Donor.getDistricts().then(function(msg){
		for(var i=0;i<25;i=i+1){
			app.districts.push(msg.data.districts[i].district)
		}
		
	});




	this.registerDonor=function(regData,valid){
		app.errorMsgReg=false;
		app.loadingReg=true;
		app.searching=false;
		if(valid){

			Donor.createDonor(app.regData).then(function(msg){
				
				if(msg.data.success){
					
					$timeout(function() {

						app.loadingReg=false;
						app.successMsgReg=msg.data.message+'.... Loading...';
						$timeout(function(){
							app.regData="";
							$location.path('/new-donation');
							
							Donor.setDonor(msg.data.BloodDonor);	
							app.donorData=Donor.getDonor();
							app.successMsgReg=false;
							//app.searching=true;
							Donor.setFlag(true);
							app.searching=Donor.getFlag();
						
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

	this.searchDonor=function(searchData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.searched=false;
		if(valid){
			Donor.search(app.searchData).then(function(msg){
				if(msg.data.success){
					$timeout(function() {
						app.loading=false;
						app.successMsg=msg.data.message+'.... Loading...';
						app.searched=true;
						Donor.setDonor(msg.data.BloodDonor);
						app.donorData=Donor.getDonor();
						
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

	this.donationSearch=function(regData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.searching=false;
		app.successMsg=false;
		if(valid){
			Donor.search(app.regData).then(function(msg){
				if(msg.data.success){
					$timeout(function() {
						
						app.successMsg=msg.data.message;
						
						app.loading=false;
						$timeout(function(){
							// app.regData="";
							
							Donor.setDonor(msg.data.BloodDonor);
							app.donorData=Donor.getDonor();
							$location.path('/new-donation');	
							// app.searching=true;
							Donor.setFlag(true);
							app.searching=Donor.getFlag();
						
						},1000);
					}, 1000);
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
	
	this.donate=function(donorData,valid){
		app.errorMsg=false;
		app.loading=true;
		app.searching=false;
		app.successMsg=false;
		if(valid){
			Donor.update(app.donorData).then(function(msg){
				if(msg.data.success){
					$timeout(function() {
						
						app.successMsg=msg.data.message;
						
						app.loading=false;
						$timeout(function(){
							app.regData="";
							Donor.setDonor();
							app.donorData=Donor.getDonor();
							$location.path('/');
							Donor.setFlag(false);
							app.searching=Donor.getFlag();	
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

});

