(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Resource', Resource);

	Resource.$inject = ['$resource', '$q', '$ionicLoading', 'appConfig'];

	// TODO: rename this service
	function Resource($resource, $q, $ionicLoading, appConfig) {
		var Resource = function(obj) {
			return $resource(appConfig.parseRestBaseUrl + 'classes/:objectName/:objectId', {
				objectName: '@objectName',
				objectId: '@objectId',
				where: '@where'
			}, {
				get: _.extend({}, {
					headers: appConfig.parseHttpsHeaders
				}, obj),
				list: _.extend({}, {
					method: 'GET',
					headers: appConfig.parseHttpsHeaders
				}, obj),
				save: _.extend({}, {
					method: 'POST',
					headers: appConfig.parseHttpsHeaders
				}, obj),
				update: _.extend({}, {
					method: 'PUT',
					headers: appConfig.parseHttpsHeaders
				}, obj)
			});
		}

		return {
			list: function(objectName, obj) {
				var d = $q.defer();
				Resource(obj).list({}, {
					objectName: objectName
				}, function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			get: function(objectName, objectId, obj) {
				var d = $q.defer();
				Resource(obj).get({}, {
					objectName: objectName,
					objectId: objectId
				}, function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise

			},
			save: function(obj) {

				var d = $q.defer();
				Resource(obj).save({}, {
					objectName: objectName
				}, function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			update: function(objectName, objectId, obj) {
				var d = $q.defer();

				var d = $q.defer();
				Resource(obj).update(params, {
					objectName: objectName,
					objectId: objectId
				}, function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise

			}
		}
	}
})();