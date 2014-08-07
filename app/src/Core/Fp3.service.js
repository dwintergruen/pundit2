angular.module('Pundit2.Core')
.constant('FP3DEFAULTS', {
    label: 'Finish',
    link: '',
    active: false,
    debug: false
})
.service('Fp3', function(BaseComponent, FP3DEFAULTS, Config, $http, $q) {
    
    var fp3 = new BaseComponent("Fp3", FP3DEFAULTS);

    // the node that containt the html text passend inside POST
    var id = '#html-storage';

    // serch and read the url of the first pundit content
    // inside the page
    fp3.getPunditContentUrl = function() {
        var url = angular.element('.pundit-content').attr('about');
        if (typeof(url) === 'undefined') {
            return '';
        }
        return url;
    };

    fp3.getNodeContent = function() {
        var content = angular.element(id).html();
        if (typeof(content) === 'undefined') {
            return '';
        }
        return content;
    };

    fp3.post = function() {
        var promise = $q.defer();

        if (fp3.options.link === '') {
            fp3.log("Error: do you must configure a link to POST data");
            return;
        }
        
        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: fp3.options.link+'?fp=on',
            data: {
                punditContent: fp3.getPunditContentUrl(),
                punditPage: fp3.getNodeContent(),
                annotationServerBaseURL: Config.annotationServerBaseURL
            },
            withCredentials: true
        }).success(function() {
            fp3.log("Success: fp3 post data");
            // TODO how close the window?
        }).error(function(msg) {
            fp3.log("Error: impossible to post data", msg);
            promise.reject();
        });

        return promise.promise;
    };

    fp3.log('Up and Running');

    return fp3;

});