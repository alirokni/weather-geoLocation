// defining globalApp module which requires delicious-app.js and ngRoute to be present
var app = angular.module('globalApp', ['deliciousApp', 'contactApp', 'ngRoute', 'ngAnimate']);

app.config(function($routeProvider){
    $routeProvider
        .when('/introduction',
            {
                    templateUrl: './partials/introduction.html',
                    controller: 'introductionContoller',
                    controllerAs: 'introduction'
            })
        .when('/updates',
            {
                    templateUrl: './partials/updates.html',
                    controller: 'updatesContoller',
                    controllerAs: 'updates'
            })
        .when('/webPerformance',
            {
                    templateUrl: './partials/webPerformance.html',
                    controller: 'webPerformanceContoller',
                    controllerAs: 'webPerformance'
            })
        .when('/ResponsiveWebDesign',
            {
                    templateUrl: './partials/ResponsiveWebDesign.html',
                    controller: 'RWDContoller',
                    controllerAs: 'RWD'
            })
        .when('/bookmarks',
            {
                    templateUrl: './partials/bookmarks.html',
                    controller: 'bookmarksContoller',
                    controllerAs: 'bookmarks'
            })
        .when('/contact',
            {
                    templateUrl: './partials/contact.html',
                    controller: 'contactContoller',
                    controllerAs: 'contact'
            })
        .otherwise(
            { 
                redirectTo: 'introduction' 
            });
});

// define deliciousApp module for bookmarks page
var deliciousApp = angular.module('deliciousApp', []);

// define contactApp module for contact page
var contactApp = angular.module('contactApp', []);

// define contactApp module for performance page
//var chartApp = angular.module('chartApp', ['googlechart']);
//var chartApp = angular.module('google-chart-example', ['googlechart'])


