(function() {
    'use strict';

    angular
        .module('app.vote')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'vote',
                config: {
                    // url: '/vote',
                    url: '/',
                    templateUrl: 'app/vote/vote.html',
                    controller: 'VoteController',
                    controllerAs: 'vm',
                    title: 'JavaScript Framework Vote',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Vote'
                    }
                }
            },
        ];
    }
})();
