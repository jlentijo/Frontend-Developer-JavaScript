/*
 # Endpoint URL #

https://api.github.com/legacy/repos/search/{query}

Note: Github imposes a rate limit of 60 request per minute. Documentation can be found at http://developer.github.com/v3/.

# Example Response JSON #

    {
        "meta": {...},
        "data": {
            "repositories": [
                {
                    "type": string,
                    "watchers": number,
                    "followers": number,
                    "username": string,
                    "owner": string,
                    "created": string,
                    "created_at": string,
                    "pushed_at": string,
                    "description": string,
                    "forks": number,
                    "pushed": string,
                    "fork": boolean,
                    "size": number,
                    "name": string,
                    "private": boolean,
                    "language": number
                },
                {...},
                {...}
            ]
        }
    }
*/
// Make module repositoriesApp
angular.module('repositoriesApp', ['ngRoute','infinite-scroll','jmdobry.angular-cache','ngResource'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/search/:keywords', {
                templateUrl: 'views/results.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

$(document).ready(function() {
//    Load an element that uses controller RepositoriesCtrl
    $('body').wrapInner('<div class="container" data-ng-controller="RepositoriesCtrl"></div>');
    $('#search')
        .attr('placeholder', 'Write a github repository...')
        .attr('data-ng-keyup', 'searchRepositories($event)')
        .attr('data-ng-model', 'keywords');
    $('#results')
        .attr('data-ng-view', '')
        .attr('infinite-scroll','loadMoreRepositories()')
        .attr('infinite-scroll-distance','2')
        .after('<span class="helper" data-ng-show="loading"><h3>Loading...</h3></span>')
        .after('<span class="helper error" data-ng-show="error"><h3>{{error_message}}</h3></span>');
//    Bootstrap with repositoriesApp
    angular.bootstrap($('body'), ['repositoriesApp']);
});
