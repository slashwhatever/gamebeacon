(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Region', Region);

	Region.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Region($resource, $q, $cacheFactory, appConfig, Resource) {
		var cache = $cacheFactory('region');
		this.regions = [];

		return {
			list: function(params) {
				this.regions = Resource.list('regions', {
					cache: cache
				});
				return this.regions
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.regions.forEach(function(region) {
					if (region.objectId === objectId) dfd.resolve(region)
				})

				return dfd.promise;
			}
		}
	}
})();