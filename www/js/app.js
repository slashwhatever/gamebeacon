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
        'gamebeacon.service',
        'gamebeacon.widgets',


				'blocks.router',
        /*
         * Feature areas
         */


         'gamebeacon.dashboard',
         'gamebeacon.login',
         'gamebeacon.tutorial',
         'gamebeacon.user',


         'gamebeacon.beacon.list.controllers',
         'gamebeacon.beacon.detail.controllers',
         'gamebeacon.beacon.create.controllers',
         'gamebeacon.beacon.card.list.directives',
         'gamebeacon.beacon.chat.directives',
         'gamebeacon.chat.services',
         'gamebeacon.shared.directives',
         'gamebeacon.fireteam.directives'
    ]);

})();