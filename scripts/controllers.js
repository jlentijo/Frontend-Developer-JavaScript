// Make controller RepositoriesCtrl in module repositoriesApp
angular.module('repositoriesApp')
    .controller('RepositoriesCtrl', ['RepositoriesServices', 'RepositoriesCache', '$location', '$rootScope', '$routeParams', '$scope',
        function( RepositoriesServices, RepositoriesCache, $location, $rootScope, $routeParams, $scope ) {

            $scope.loading = false;
            $scope.error = false;

            $scope.clearResults = function() {
                $scope.page = 1;
                $scope.repositories = [];
            };

            $scope.searchRepositories = function( event ){
                if(event.keyCode == 13 && $scope.keywords) {
                    $location.path('/search/'+$scope.keywords);
                }
            };

            $rootScope.$on('$routeChangeSuccess', function(next, current) {
                if($routeParams.keywords){
                    $scope.keywords = $routeParams.keywords;
                    $scope.clearResults();
                    $scope.showLoading(true);
                    $scope.getRepositoriesList($routeParams.keywords, $scope.page,
                        RepositoriesCache.get($routeParams.keywords,$scope.page));
                }
            });

            $scope.loadMoreRepositories = function(){
                if($scope.hasMoreResults && !$scope.loading){
                    $scope.showLoading(true);
                    $scope.getRepositoriesList($routeParams.keywords, $scope.page,
                        RepositoriesCache.get($routeParams.keywords,$scope.page));
                }
            };

            $scope.getRepositoriesList = function( keywords, page, etag ){

                RepositoriesServices.getRepositoriesFromGitHub( keywords, page, etag)
                    .then(function( response ){
                        angular.forEach(response['repositories'], function( item ){
                            $scope.repositories.push(item)
                        })
                        RepositoriesCache.set(keywords,page,response['etag']);
                        $scope.page++;
                        $scope.hasMoreResults = response['repositories'].length == 100;
                        $scope.showLoading(false);
                    }, function( error_message ){
                        $scope.showError( error_message );
                    });
            };

            $scope.showInfoRepository = function( event ){
                var el = event.currentTarget;
                $(el).find('.info').slideToggle( "slow" );
            };

            $scope.showLoading = function( show ) {
                $scope.loading = show;
                $scope.error = false;
            };

            $scope.showError = function( error_message ) {
                $scope.loading = false;
                $scope.error = true;
                $scope.error_message = error_message;
            };
        }]
);