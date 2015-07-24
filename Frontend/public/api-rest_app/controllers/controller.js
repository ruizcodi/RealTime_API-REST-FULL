'use strict'
angular.module('API', ['ngRoute'])

// angular.module('myApp.services', []).
// APP.factory('socket', function (socketFactory) {
// return socketFactory()
// }).
// value('version', '0.1')

.controller('AppCtrl',['$scope','$http','socket',function ($scope, $http, socket) {  
    // delete $httpProvider.defaults.headers.common["X-Requested-With"]
	console.log("Hello world from controller2")

/************ SOCKET IO ********************/

socket.on('notification', function (data) {
	var n = data.mensaje + '<br>';
	document.getElementById("notificationContainer").innerHTML += n;
});

$scope.detenerNotificaciones = function(){
	socket.emit('stopNotifications');
}


socket.on('emit:add', function (message) {
    // $scope.contactlist.push(message);
    refresh()
});

/************ SOCKET IO ********************/

	var refresh = function() {
		$http.get('/api3000').success(function (res) {
			console.log("I got the data I requested")
			$scope.contactlist = res
			$scope.contact = ""
		})
	}
	refresh()

	$scope.addContact = function() {
		//console.log($scope.contact)
		$http.post('/api3000', $scope.contact).success(function (res) {
			refresh()
			console.log(res)
			// console.log(res.insertId)
			// $scope.contact.id = res.insertId
			socket.emit('emit:add',{})
		})
	}

	$scope.remove = function(id) {
		//console.log(id)
		$http.delete('/api3000/' + id).success(function (res) {
			refresh()
			socket.emit('emit:add',{})
		})
	}
	$scope.update = function() {
		//console.log($scope.contact.id)
		$http.put('/api3000/' + $scope.contact.id, $scope.contact).success(function (res) {
			refresh()
			socket.emit('emit:add',{})
		})
	}
	$scope.edit = function(id) {
		//console.log(id)
		$http.get('/api3000/' + id).success(function (res) {
			$scope.contact = res
			console.log($scope.contact)
		})
	}
	$scope.deselect = function() {
		$scope.contact = ""
	} 
}])

 // From http://briantford.com/blog/angular-socket-io
.factory('socket', function ($rootScope) {
	'use strict';
    var socket = io.connect('http://10.94.16.116:3000/');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});


