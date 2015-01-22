'use strict';

angular.module('repositoriesApp')
    .factory('RepositoriesCache', ['$angularCacheFactory', function($angularCacheFactory) {

        var repositoriesCache = $angularCacheFactory('repositories-cache', {
            maxAge: 900000, // Items added to this cache expire after 15 minutes.
            cacheFlushInterval: 3600000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
        });

        return {
            get: function(keywords, page){
                return repositoriesCache.get(keywords+'/'+page);
            },
            set: function(keywords, page, etag){
                repositoriesCache.put(keywords+'/'+page, etag);
            }
        };
    }])
    .factory('RepositoriesServices', [ '$http', function( $http ) {

        return {
            transformDataToRepositories: function( data ){
                var repositories = [];
                angular.forEach(data, function( item ){
                    repositories.push({
                        'owner': item.owner,
                        'name': item.name,
                        'language': item.language,
                        'followers': item.followers,
                        'url': item.url,
                        'description': item.description
                    });
                });
                return repositories;
            },
            getRepositoriesFromGitHub: function ( keywords, page, etag ) {
                var _this = this;
                var url = 'https://api.github.com/legacy/repos/search/'+keywords+'?start_page='+page;
                return $http.get(url, {}, { headers: { 'If-None-Match': etag } }
                    ).then(function( response ){
                        if( response.data.repositories.length == 0) {
                            throw 'Repositories not found!';
                        }else{
                            return {
                                'repositories' : _this.transformDataToRepositories( response.data.repositories ),
                                'etag': response.headers('Etag')
                            };
                        }

                    }, function( httpError ){
                        throw httpError.data.message;
                    });
            }
        };

    }]);