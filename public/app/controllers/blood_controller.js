angular.module('bloodCtrl',['bloodServices'])

.controller('searchCtrl',function($location,$timeout,Blood){

	var app=this;
	app.limit=1;
	app.bloodList={};
	app.searchBlood=function(searchData,valid){
		app.errorMsgReg=false;
		app.loadingReg=true;
		app.searching=false;
		app.showMoreError=false;
		
		if(valid){

			Blood.search(app.searchData).then(function(msg){
				
				if(msg.data.success){
					$timeout(function() {
						app.successMsgReg=msg.data.message+'.... Loading...';
						$timeout(function(){
							app.loadingReg=false;
							app.bloodList=msg.data.BloodPacket;
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


	app.showMore=function(number){
		app.showMoreError=false;
		if(number>0){
			app.limit=number;

		}
		else{
			
			app.showMoreError="Please enter a valid number"
		}

	}


	app.showAll=function(){
		app.showMoreError=false;
		app.limit=app.bloodList.length;

	}
});

