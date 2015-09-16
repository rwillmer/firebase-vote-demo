/* jshint -W106 */
(function() {
    'use strict';

    angular
        .module('app.vote')
        .directive('demoVoteChoice', fn);

    /* @ngInject */
    function fn() {

        VoteChoice.$inject = ['$scope', '$rootScope', 'fbutil', '$window', 'Firebase'];

        var directive = {
            restrict: 'AE',
            templateUrl: 'app/vote/vote.choice.tpl.html',
            controller: VoteChoice,
            controllerAs: 'vm',
        };
        return directive;
    }

    function VoteChoice($scope, $rootScope, fbutil, $window, Firebase) {
        var vm = this;
        var ref = new Firebase('https://vote-demo.firebaseio.com');

        // debugger;

        vm.name = $scope.choice.name;
        vm.slug = $scope.choice.$id;
        vm.toggle = toggle;

        function toggle() {
            var me = ref.getAuth();
            if (me === null) {
                $window.alert('You need to login to choose');
                return;
            }

            console.log('option:' + vm.slug);

            var mychoice = ref
                .child('choices')
                .child(vm.slug)
                .child('people')
                .child(me.uid);
            mychoice.once('value', function(data) {
                if (data.val() === null) {
                    console.log('setting choice: ' + vm.slug + ' : ' + me.uid);
                    mychoice.set($rootScope.user);
                } else {
                    console.log('removing choice: ' + vm.slug + ' : ' + me.uid);
                    mychoice.remove();
                }
                // console.log(vm.slug + ' toggled ' + me.uid);
            });
            $scope.$watch('mychoice', function(newv, oldv) {
                var thischoice = ref.child('choices').child(vm.slug);
                var people = thischoice.child('people');
                people.once('value', function(data) {
                    var snapshot = data.val();
                    var count = 0;
                    /* jshint -W089 */
                    for (var i in snapshot) {
                        count += 1;
                    }
                    thischoice.child('count').set(count);
                    console.log(vm.slug + ' count ' + count);
                });
            });
        }
    }

})();
