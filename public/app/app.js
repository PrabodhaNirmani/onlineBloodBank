angular.module('userApp',['appRoutes','userCtrl','userServies','ngAnimate','mainController','authServices','donorCtrl','donorServices','bloodCtrl','bloodServices','emailCtrl','eventCtrl','eventServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
	
});


