		(function() {
			'use strict';

			angular
				.module('gamebeacon.service')
				.factory('Msg', Msg);

			//Msg.$inject = [''];

			function Msg() {
				return {
					msg: function(msg) {
						var out = '',
							messages = {
								createBeacon: 'Your gamebeacon kicks off in 15 minutes. Have you invited everyone into your game?',
								joinedBeacon: 'A gamebeacon you joined kicks off in 15 minutes. Are you ready to play?'
							};

						try {
							return messages[msg]
						} catch (e) {
							return ''
						}
					}
				}
			}
		})();