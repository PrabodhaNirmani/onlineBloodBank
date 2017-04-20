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

	.when('/activate/:token',{
		templateUrl:'app/views/pages/activate/activate.html',
		controller:'emailCtrl',
		controllerAs:'emailCtrl',
		authenticate:false
	})

	.when('/login',{
		templateUrl:'app/views/pages/user/login.html',
		
		authenticate:false
		

	})
	.when('/resend',{
		templateUrl:'app/views/pages/activate/resend.html',
		controller:'resendCtrl',
		controllerAs:'resend',
		authenticate:false
	})

	.when('/forgot-password',{
		templateUrl:'app/views/pages/activate/forgot_password.html',
		controller:'passwordCtrl',
		controllerAs:'password',
		authenticate:false
		

	})
	.when('/forgot-username',{
		templateUrl:'app/views/pages/activate/forgot_username.html',
		controller:'usernameCtrl',
		controllerAs:'username',
		authenticate:false
		

	})

	.when('/reset-password/:token',{
		templateUrl:'app/views/pages/activate/reset_password.html',
		controller:'resetCtrl',
		controllerAs:'reset',
		authenticate:false

	})

	.when('/change-password',{
		templateUrl:'app/views/pages/activate/change_password.html',
		controller:'changeCtrl',
		controllerAs:'change',
		permission:['admin','staff'],
		authenticate:true		
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
		controller:'searchCtrl',
		controllerAs:'search',
		authenticate:true,
		permission:['admin','staff']

	})
	.when('/release-blood',{
		templateUrl:'app/views/pages/staff/release_blood.html',
		controller:'releaseCtrl',
		controllerAs:'release',
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

	.when('/new-donation',{
		templateUrl:'app/views/pages/staff/new_donation.html',
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
		
		if(next.$$route){
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
				if(Auth.isLoggedIn()){
					event.preventDefault();
					$location.path('/profile');
				}

			}	
		}
		else{
			if(Auth.isLoggedIn()){
				event.preventDefault();
				$location.path('/profile');
			}

		}
		
	});

}]);