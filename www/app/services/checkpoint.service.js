(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Checkpoint', Checkpoint);

	Checkpoint.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Checkpoint($resource, $q, $cacheFactory, appConfig, Resource) {
		var cache = $cacheFactory('checkpoint');
		this.checkpoints = [];

		return {
			list: function(params) {
				this.checkpoints = Resource.list('checkpoints', {
					cache: cache,
					params: {
						'order': 'order'
					}
				});
				return this.checkpoints
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.checkpoints.forEach(function(checkpoint) {
					if (checkpoint.objectId === objectId) dfd.resolve(checkpoint)
				})

				return dfd.promise;
			}
		}
	}
})();