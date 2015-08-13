angular.module('destinybuddy.puser.services', ['ngResource', 'destinybuddy.config'])

.factory('PUserService', ['$resource', '$rootScope', '$q', 'appConfig', function($resource, $rootScope, $q, appConfig) {

	var PUser = function(id) {
		return $resource(appConfig.parseRestBaseUrl + 'classes/pusers/:id', {
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
			PUser(id).get(function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		list: function() {
			var d = $q.defer();

			PUser().list(function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		save: function() {
			var d = $q.defer();

			PUser().save(function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		update: function(puser, params) {
			var d = $q.defer();

			PUser().update(puser, JSON.stringify(params), function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		}
	}
}])

