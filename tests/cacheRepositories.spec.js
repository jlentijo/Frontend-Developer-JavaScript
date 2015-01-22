describe("test cache ETag value with angular-cache library", function() {

    var $resource,
        createController,
        $scope,
        keywords = 'Frontend-Developer-JavaScript',
        page = '1';

    // Set up the module
    beforeEach(module('repositoriesApp'));

    beforeEach(inject(function($injector) {

        var RepositoriesServices = $injector.get('RepositoriesServices');

        $resource = $injector.get('$resource');

        spyOn(RepositoriesServices, "getRepositoriesFromGitHub").and.callFake(function( keywords, page, etag ) {
            return {
                then: function(callback){
                    return callback({
                        'repositories' : $resource("dummy_responses/standard_response.json").get(),
                        'etag': etag
                    });
                }
            };
        });

        $scope = $injector.get('$rootScope').$new();
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('RepositoriesCtrl', {'$scope' : $scope });
        };
    }));

    it("test only angular-cache caching ETag value", inject(function( RepositoriesCache ){

        RepositoriesCache.set(keywords,page,'XXXXXXXXXX');
        expect(RepositoriesCache.get(keywords,page)).toBe('XXXXXXXXXX');

    }));

    it("testing caching ETag value when call to controller", inject(function( RepositoriesCache ){

        RepositoriesCache.set(keywords,page,'YYYYYYYYYY');

        var RepositoriesCtrl = createController();

        $scope.clearResults();
        $scope.getRepositoriesList(keywords, page, 'XXXXXXXXXX');

        expect(RepositoriesCache.get(keywords,page)).toBe('XXXXXXXXXX');

    }));

});


