describe('get repositories from GitHub API with RepositoriesServices', function() {

    var $httpBackend,
        authRequestHandler,
        $resource,
        keywords = 'Frontend-Developer-JavaScript',
        page = '1',
        url = 'https://api.github.com/legacy/repos/search/'+keywords+'?start_page='+page;

    // Set up the module
    beforeEach(module('repositoriesApp'));

    // Configure standard dummy response to return from GitHub API
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $resource = $injector.get('$resource');
        authRequestHandler = $httpBackend.when('GET', url)
            .respond(function() {
                return $resource("dummy_responses/standard_response.json").get();
            });

    }));

    it('should be called', inject(function (RepositoriesServices) {
        RepositoriesServices.getRepositoriesFromGitHub(keywords,page,undefined)
            .then(function (data) {
                expect(data).toBeDefined();
                $httpBackend.flush();
            });
    }));

    it('should return an undefined error', inject(function (RepositoriesServices) {

        authRequestHandler.respond(500, 'Undefined error!');

        RepositoriesServices.getRepositoriesFromGitHub(keywords,page,undefined)
            .then(function(){}, function( error ){
                expect(error).toThrow('Undefined error!');
                $httpBackend.flush();
            });
    }));

    it('should return an error "Repositories not found!"', inject(function (RepositoriesServices) {

        authRequestHandler.respond({ "repositories": []});
        RepositoriesServices.getRepositoriesFromGitHub(keywords,page,undefined)
            .then(function(){}, function( error ){
                expect(error).toThrow('Repositories not found!');
                $httpBackend.flush();
            });
    }));

});