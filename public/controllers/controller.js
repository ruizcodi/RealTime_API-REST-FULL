'use strict'

var APP = angular.module('API',['btford.socket-io'])

// angular.module('myApp.services', []).
APP.factory('socket', function (socketFactory) {
return socketFactory()
}).
value('version', '0.1')

APP.controller('AppCtrl',['$scope','$http',	function ($scope, $http) { 
    
    //delete $httpProvider.defaults.headers.common["X-Requested-With"]

	console.log("Hello world from controller2")

	var refresh = function() {
		$http.get('/load').success(function (res) {
			console.log("I got the data I requested")
			$scope.contactlist = res
			$scope.contact = ""
		})
	}
	refresh()
	$scope.addContact = function() {
		//console.log($scope.contact)
		$http.post('/load', $scope.contact).success(function (res) {
			console.log(res)
			refresh()
		})
	}
	$scope.remove = function(id) {
		//console.log(id)
		$http.delete('/load/' + id).success(function (res) {
			refresh()
		})
	}
	$scope.edit = function(id) {
		//console.log(id)
		$http.get('/load/' + id).success(function (res) {
			$scope.contact = res
			console.log($scope.contact)
		})
	}
	$scope.update = function() {
		//console.log($scope.contact.id)
		$http.put('/load/' + $scope.contact.id, $scope.contact).success(function (res) {
			refresh()
		})
	}
	$scope.deselect = function() {
		$scope.contact = ""
	} 
}])

