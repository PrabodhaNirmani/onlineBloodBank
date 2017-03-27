var app=angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){
	$routeProvider
	.when('/',{
		templateUrl:'app/views/pages/home.html',
		authenticate:false,
		permission:false
	})

	.when('/about',{
		templateUrl:'app/views/pages/about.html',
		authenticate:true,
		permission:['admin','staff']
	})
	
	.when('/register-staff',{
		templateUrl:'app/views/pages/admin/register_staff_member.html',
		controller:'regUser',
		controllerAs:'registerUser',
		authenticate:true,
		permission:['admin']

	})

	.when('/register',{
		templateUrl:'app/views/pages/user/register.html',
		controller:'regUser',
		controllerAs:'registerUser',
		authenticate:true,
		permission:['admin']

	})

	.when('/login',{
		templateUrl:'app/views/pages/user/login.html',
		authenticate:false
		

	})

	.when('/logout',{
		templateUrl:'app/views/pages/user/logout.html',
		authenticate:true,
		permission:['admin','staff']
		

	})
	.when('/profile',{
		templateUrl:'app/views/pages/user/profile.html',
		authenticate:true,
		permission:['admin','staff']


	})
	
	.when('/register-donor',{
		templateUrl:'app/views/pages/staff/register_donor.html',
		controller:'regDonation',
		controllerAs:'registerDonation',
		authenticate:true,
		permission:['staff']
	})

	.when('/search-donor',{
		templateUrl:'app/views/pages/staff/search_donor.html',
		controller:'regDonation',
		controllerAs:'registerDonation',
		authenticate:true,
		permission:['admin','staff']
	})

	.when('/search-blood',{
		templateUrl:'app/views/pages/staff/search_blood.html',
		controller:'bloodCtrl',
		controllerAs:'bloodController',
		authenticate:true,
		permission:['admin','staff']

	})
	.when('/release-blood',{
		templateUrl:'app/views/pages/staff/release_blood.html',
		controller:'bloodCtrl',
		controllerAs:'bloodController',
		authenticate:true,
		permission:['staff']

	})
	
	.when('/update-donor',{
		templateUrl:'app/views/pages/staff/update_donation.html',
		controller:'regDonation',
		controllerAs:'registerDonation',
		authenticate:true,
		permission:['staff']
	})

	.when('/donor-profile',{
		templateUrl:'app/views/pages/staff/blood_donor_profile.html',
		authenticate:true,
		permission:['admin','staff']
		// controller:'regDonation',
		// controllerAs:'registerDonation'
	})

	.when('/donation-campaign',{
		templateUrl:'app/views/pages/donation_campaigns.html',
		authenticate:false,
		permission:false
	})

	.when('/emergency-request',{
		templateUrl:'app/views/pages/emergency_requests.html',
		authenticate:false,
		permission:false
	})

	

	.otherwise({redirectTo:'/'});

	$locationProvider.html5Mode({
		enabled:true,
		requireBase:false
	});

	
});

app.run(['$rootScope','Auth','$location', function($rootScope,Auth,$location){
	
	$rootScope.$on('$routeChangeStart',function(event,next,current){
		if(next.$$route.authenticate==true){
			if(!Auth.isLoggedIn()){
				event.preventDefault();
				$location.path('/');
			} else if(next.$$route.permission){
				Auth.getUser().then(function(data){
					if(next.$$route.permission[0]!==data.data.role){
						if(next.$$route.permission[1]!==data.data.role){
							event.preventDefault();
							$location.path('/about');

						}
					}
				});


			}


		} else if(next.$$route.authenticate==false){
			// if(Auth.isLoggedIn()){
			// 	event.preventDefault();
			// 	$location.path('/profile');
			// }

		}
	});

}]);