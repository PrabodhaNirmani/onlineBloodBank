angular.module('eventCtrl',['eventServices'])

.controller('campaignCtrl',function($location,$timeout,Event){

	var app=this;
	app.campaigns=false;
	app.pending=false;
	app.showFlag=false;


	Event.getDonationCampaigns().then(function(msg){
		if(msg.data.success){
			console.log("suc");
			app.campaigns=msg.data.campaigns;
		}
		else{
			console.log(msg);
		}

	});
	// Event.getPendingCampaigns().then(function(msg){
	// 	if(msg.data.success){
	// 		console.log("suc");
	// 		app.pending=msg.data.campaigns;
	// 		console.log(app.pending.length)

	// 	}
	// 	else{
	// 		console.log(msg);
	// 	}

	// });

	// app.show=function(){
	// 	console.log(app.showFlag)
	// 	app.showFlag=true;
	// 	console.log(app.showFlag)


	// }
	// app.confirm=function(data){
	// 	console.log("data")
	// }

	

})

// .controller('confirmCtrl',function($location,$timeout,Event){

// 	var app=this;
// 	app.requests=false;



	

// })


.controller('requestCtrl',function($location,$timeout,Event){

	var app=this;
	app.requests=false;


	Event.getEmergencyRequests().then(function(msg){
		if(msg.data.success){
			console.log(msg);
			app.requests=msg.data.requests;
		}
		else{
			console.log(msg);
		}

	});

// 	app.removeEmergencyRequest=function(data){
// 		console.log("asas");
// 		Event.removeEmergencyRequest().then(function(msg){

// 		})
// 	}

// 	app.click=function(){
// console.log("djk")
// 	}

	

});



