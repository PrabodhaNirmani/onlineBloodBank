angular.module('bloodCtrl',['bloodServices'])

.controller('searchCtrl',function($location,$timeout,Blood,BloodID){

	var app=this;
	app.limit=10;
	app.number=null;

	app.searchBlood=function(searchData,valid){
		app.errorMsgReg=false;
		app.loadingReg=true;
		app.searching=false;
		app.showMoreError=false;
		app.bloodList={};
		
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
		if(app.number>0){
			app.limit=app.number;

		}
		else{
			
			app.showMoreError="Please enter a valid number"
		}

	}


	app.showAll=function(){
		app.number=null
		app.showMoreError=false;
		app.limit=undefined;

	}

	app.loadReleasePage=function(id){
		if(id!=null){
			BloodID.setId(id);

			$location.path('/release-blood');

		}

	}
})

.controller('releaseCtrl',function($location,$timeout,Blood){

	var app=this;
	app.blood=null;
	
	Blood.releaseBloodRequest().then(function(data){
		if(data.data.success){
			app.blood=data.data.blood;
			// console.log(app.blood);

		}
		else{
			$location.path('/search-blood');
		}

	});

	app.releaseBlood=function(){
		app.successMsg=false;
		app.errorMsg=false;
		app.loading=true;
		Blood.releaseBlood(app.blood._id).then(function(msg){
			
			if(msg.data.success){
					
				$timeout(function(){
					app.successMsg=msg.data.message+'.... Redirecting...';	
					app.loading=false;
					$timeout(function(){
						$location.path('/search-blood');
						app.successMsg=false;
						app.errorMsg=false;
						
					},2000);
					
					
				},2000);
			}
			else{	
	
			
				app.errorMsg=msg.data.message+'.... Redirecting...';
				app.loading=false;
				$timeout(function(){
					$location.path('/search-blood');
					app.successMsg=false;
					app.errorMsg=false;
					
				},2000);
				
			}

					
				

		});

	}

	
})

.controller('showReleaseCtrl',function(Blood){
	var app=this;
	app.errorMsg=false;
	app.successMsg=false;
	app.bloodList=false;
	app.limit=20;
	app.number=null;
	app.showMoreError=false;

	Blood.getReleasedBlood().then(function(data){
		if(data.data.success){
			app.successMsg=data.data.message;
			app.bloodList=data.data.blood;


		}
		else{
			app.errorMsg=data.data.message;

		}
	});

	app.showMore=function(number){
		app.showMoreError=false;
		if(app.number>0){
			app.limit=app.number;

		}
		else{
			
			app.showMoreError="Please enter a valid number"
		}

	}


	app.showAll=function(){
		app.number=null
		app.showMoreError=false;
		app.limit=undefined;

	}

})

.controller('showExpireCtrl',function(Blood){
	var app=this;
	app.errorMsg=false;
	app.successMsg=false;
	app.bloodList=false;
	app.limit=20;
	app.number=null;
	app.showMoreError=false;

	Blood.getExpiredBlood().then(function(data){
		if(data.data.success){
			app.successMsg=data.data.message;
			app.bloodList=data.data.blood;


		}
		else{
			app.errorMsg=data.data.message;

		}
	});

	app.showMore=function(number){
		app.showMoreError=false;
		if(app.number>0){
			app.limit=app.number;

		}
		else{
			
			app.showMoreError="Please enter a valid number"
		}

	}


	app.showAll=function(){
		app.number=null
		app.showMoreError=false;
		app.limit=undefined;

	}

});




