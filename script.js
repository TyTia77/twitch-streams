var app = angular.module('twitch', ['ngRoute']);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//     $locationProvider.hashPrefix('');
//     $routeProvider
//         .when('/', {
//             templateUrl: 'views/all.html'
//         })
//         .when('/online', {
//             templateUrl: 'views/online.html'
//         })
//         .when('/offline', {
//             templateUrl: 'views/offline.html'
//         })
//         .otherwise({
//             redirectTo: '/'
//         });
// }]);

app.controller('mainCtrl', ['$scope', '$http', function($scope, $http){

    var channels = [
        "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx",
        "RobotCaleb", "noobs2ninjas"
    ];

    channels.forEach(function(user){
        $scope.streamers = [];

        var url = 'https://wind-bow.gomix.me/twitch-api/';
        var cors = 'https://cors-anywhere.herokuapp.com/';
        // var cors = 'http://60.242.62.79:8080/';
        // var cors = 'http://localhost:8080/';

        $http.get(cors +url +'streams/' +user).then(function(data){

            var chan = data.data._links.channel;
            var user = chan.slice(chan.lastIndexOf('/')+1, chan.length).toLowerCase();
            var status;

            if(data.data.stream === null){
                status = 'offline';
            } else if (data.data.stream === undefined){
                status = 'account closed';
            } else{
                status = 'online';
            }

            $http.get(cors +url +'channels/' +user).then(function(data){
                $scope.streamers.push({
                    'user': user,
                    'status': status,
                    'logo': data.data.logo,
                    'display_name': data.data.display_name,
                    'url': data.data.url,
                    'followers': data.data.followers
                });
            });
        });

    });

    // handle navbar select
    $('ul li').on('click', function(){
        $('ul li').removeClass('active');
        $scope.status = $(this).attr('data-value');
        $(this).addClass('active');
    });

    $scope.userCardClick = function(e){
        var link = e.currentTarget.dataset.link;
        window.open(link, '_blank');
    }
}]);
