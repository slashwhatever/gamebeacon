(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.factory('User', User);

	User.$inject = ['$resource', '$rootScope', 'appConfig'];

	function User($resource, $rootScope, appConfig) {

		var User = function(id) {
			return $resource(appConfig.parseRestBaseUrl + 'users/:id', {
				id: '@id'
			}, {
				get: {
					headers: _.extend({}, {
						'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
					}, appConfig.parseHttpsHeaders)
				},
				list: {
					method: 'GET',
					headers: _.extend({}, {
						'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
					}, appConfig.parseHttpsHeaders)
				},
				save: {
					method: 'POST',
					headers: _.extend({}, {
						'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
					}, appConfig.parseHttpsHeaders)
				},
				update: {
					method: 'PUT',
					headers: _.extend({}, {
						'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
					}, appConfig.parseHttpsHeaders)
				}
			});
		}

		return {
			get: function(id) {
				var d = $q.defer();

				User(id).get(function(response) {
					d.resolve(response);
				}, function(error){
					d.reject(error)
				});
				return d.promise
			},
			list: function() {
				var d = $q.defer();
				User().list(function(response) {
					d.resolve(response);
				}, function(error){
					d.reject(error)
				});
				return d.promise
			},
			save: function() {
				var d = $q.defer();
				User().save(function(response) {
					d.resolve(response);
				}, function(error){
					d.reject(error)
				});
				return d.promise
			},
			update: function(id) {
				var d = $q.defer();
				User(id).update(function(response) {
					d.resolve(response);
				}, function(error){
					d.reject(error)
				});
				return d.promise
			}
		}
	}
})();