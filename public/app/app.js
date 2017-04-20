angular.module('userApp',['appRoutes','userCtrl','userServies','ngAnimate','mainController','authServices','donorCtrl','donorServices','bloodCtrl','bloodServices','emailCtrl',])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
	
});


