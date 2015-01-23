'use strict';

// Make module repositoriesApp
angular
    .module('repositoriesApp', [
        'ngRoute',
        'infinite-scroll',
        'jmdobry.angular-cache',
        'ngResource'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/search/:keywords', {
                templateUrl: 'views/results.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

$(document).ready(function () {
    // Load an element that uses controller RepositoriesCtrl
    $('body').wrapInner('<div class="container" data-ng-controller="RepositoriesCtrl"></div>');
    $('#search')
        .attr('placeholder', 'Write a github repository...')
        .attr('data-ng-keyup', 'searchRepositories($event)')
        .attr('data-ng-model', 'keywords');
    $('#results')
        .attr('data-ng-view', '')
        .attr('infinite-scroll', 'loadMoreRepositories()')
        .attr('infinite-scroll-distance', '2');
    // Bootstrap with repositoriesApp
    angular.bootstrap($('body'), ['repositoriesApp']);
});