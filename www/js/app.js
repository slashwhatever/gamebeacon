// angular.module is a global place for creating, registering and retrieving Angular modules
// 'gamebeacon' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'gamebeacon.controllers' is found in controllers.js
//

(function() {
    'use strict';

    angular.module('gamebeacon', [
        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'gamebeacon.core',
        'gamebeacon.widgets',

        'gamebeacon.dashboard',
        'gamebeacon.login',
        'gamebeacon.tutorial',

        'gamebeacon.user',

        /*
         * Feature areas
         */
         //'gamebeacon.user.register.controllers',
         //'gamebeacon.user.reset.controllers',
         //'gamebeacon.user.login.controllers',
         //'gamebeacon.user.profile.controllers',
         //'gamebeacon.user.reset.controllers',
         //'gamebeacon.user.dashboard.controllers',
         'gamebeacon.beacon.list.controllers',
         'gamebeacon.beacon.detail.controllers',
         'gamebeacon.beacon.create.controllers',
         //'gamebeacon.beacon.list.calendar.directives',
         'gamebeacon.beacon.card.list.directives',
         //'gamebeacon.beacon.tabset.directives',
         //'gamebeacon.beacon.header.directives',
         //'gamebeacon.beacon.timer.directives',
         'gamebeacon.beacon.chat.directives',
         //'gamebeacon.beacon.meta.directives',
         //'gamebeacon.beacon.actions.directives',
         //'gamebeacon.tutorial.controllers',
         'gamebeacon.services',
         'gamebeacon.user.services',
         'gamebeacon.puser.services',
         'gamebeacon.chat.services',
         'gamebeacon.shared.directives',
         'gamebeacon.fireteam.directives',
         //'gamebeacon.beacon.scheduler.directives',
         //'gamebeacon.beacon.register.directives',
         'templates',
         'angularMoment',
         'ng-mfb','ngIOS9UIWebViewPatch'
    ]);

})();