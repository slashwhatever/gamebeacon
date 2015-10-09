		(function() {
			'use strict';

			angular
				.module('gamebeacon.service')
				.factory('Log', Log);

			Log.$inject = ['$log'];

			function Log($log) {
				return {
					log: function(message, level) {
						switch (level) {
							case 'error':
								$log.error(message);
								break;
							case 'warn':
								$log.warn(message);
								break;
							case 'info':
								$log.info(message);
								break;
							case 'log':
								$log.log(message);
								break;
							case 'debug':
								$log.debug(message);
								break;
							default:
								$log.debug(message);
						}
					}
				}
			}
		})();