(function () {
    'use strict';

    angular
        .module('app.vote')
        .controller('VoteController', VoteController);

    VoteController.$inject = ['logger', 'fbutil', 'Firebase', '$http', '$scope', '$rootScope'];
    /* @ngInject */
    function VoteController(logger, fbutil, Firebase, $http, $scope, $rootScope) {
        var vm = this;
        var ref = new Firebase('https://vote-demo.firebaseio.com');
        // ref.unauth();
        var authData = ref.getAuth();
        handleAuth(authData);

        vm.title = 'Vote';
        vm.loginWith = loginWith;

        loadChoices();
        activate();

        ref.onAuth(handleAuth);

        function handleAuth(authData) {
            if (!authData) {
                $rootScope.user = null;
                return;
            }

            var userref = ref.child('users').child(authData.uid);
            userref.once('value', function(data) {
                var user = data.val();
                if (user !== null) {
                    $rootScope.user = user;
                    return;
                }

                // save new profile

                var imageUrl = getImageUrl(authData);
                console.log('imageUrl:' + imageUrl);
                user = {
                    provider: authData.provider,
                    displayName: getDisplayName(authData),
                    userName: getUserName(authData),
                    imageUrl: imageUrl,
                };
                userref.set(user);
                /*
                var imageUrl = getImageUrl(authData);
                debugger;
                $http.get(imageUrl).then(function(response) {
                    debugger;
                    user.imageUrl = imageUrl;
                    user.image = response.data;
                    userref.set(user);
                });
                */
            });
        }

        function activate() {
            logger.info('Activated Vote View');
        }

        function initChoices() {
            var options = ['AngularJS', 'Ember', 'ReactJS', 'Ionic'];

            // debugger;
            for (var i in options) {
                var opt = options[i];
                var choice = {
                    count: 0,
                    people: [],
                };
                ref.child('choices').child(opt).set(choice);
            }
        }

        function loadChoices() {
            vm.choices = fbutil.syncArray(
                '/choices',
                {'orderByChild': 'count'}
            );
            vm.choices.$loaded()
                .then(function(data) {
                    // debugger;
                    if (!data.length) {
                        initChoices();
                    }
                })
                .catch(function(error) {
                    console.error("Error:", error);
                });
        }

        function loginWith(service) {
            if (service === 'twitter') {
                return loginWithTwitter();
            } else {
                console.log('Unknown service: ' + service);
            }
        }

        function loginWithTwitter() {
            // debugger;

            ref.authWithOAuthRedirect('twitter', function(error) {
                if (error) {
                    console.log('Login Failed!', error);
                } else {
                    /* jshint -W035 */
                    // We'll never get here, as the page will redirect on success.
                }
            });
        }

        // find a suitable name based on the meta info given by each provider
        function getDisplayName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
            }
        }

        // find a suitable name based on the meta info given by each provider
        function getUserName(authData) {
            switch (authData.provider) {
                // case 'password':
                //   return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.username;
                // case 'facebook':
                //   return authData.facebook.displayName;
            }
        }

        // find a suitable image based on the meta info given by each provider
        function getImageUrl(authData) {
            switch (authData.provider) {
                // case 'password':
                //   return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    /* jshint -W106 */
                    return authData.twitter.cachedUserProfile.profile_image_url;
                // case 'facebook':
                //   return authData.facebook.displayName;
            }
        }
    }
})();
