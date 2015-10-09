(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Mic', Mic);

	Mic.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Mic($resource, $q, $cacheFactory, appConfig, Resource) {

		var cache = $cacheFactory('mic');
		this.mics = [];

		return {
			list: function(params) {
				this.mics = Resource.list('mics', {
					cache: cache
				});
				return this.mics
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.mics.forEach(function(mic) {
					if (mic.objectId === objectId) dfd.resolve(mic)
				})

				return dfd.promise;
			}
		}
	}
})();
