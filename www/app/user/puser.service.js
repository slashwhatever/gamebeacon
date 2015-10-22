(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.factory('PUser', PUser);

	PUser.$inject = ['$resource', '$q', 'appConfig', '$ionicLoading'];

	function PUser($resource, $q, appConfig, $ionicLoading) {

		var me = this,
			PUser = function(objectId) {
				return $resource(appConfig.parseRestBaseUrl + 'classes/pusers/:objectId', {
					objectId: '@objectId'
				}, {
					get: {
						headers: _.extend({}, {
							'X-Parse-Session-Token': me.currentUser.sessionToken
						}, appConfig.parseHttpsHeaders)
					},
					list: {
						method: 'GET',
						headers: _.extend({}, {
							'X-Parse-Session-Token': me.currentUser.sessionToken
						}, appConfig.parseHttpsHeaders)
					},
					save: {
						method: 'POST',
						headers: _.extend({}, {
							'X-Parse-Session-Token': me.currentUser.sessionToken
						}, appConfig.parseHttpsHeaders)
					},
					update: {
						method: 'PUT',
						headers: _.extend({}, {
							'X-Parse-Session-Token': me.currentUser.sessionToken
						}, appConfig.parseHttpsHeaders)
					},
					updateFriends: {
						method: 'PUT',
						headers: _.extend({}, {
							'X-Parse-Session-Token': me.currentUser.sessionToken
						}, appConfig.parseHttpsHeaders),
						params: {
							friends: '@friends'
						}
					}
				});
			}

		return {
			get: function(objectId) {
				var d = $q.defer();
				PUser().get({objectId: objectId}, function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			list: function() {
				var d = $q.defer();

				PUser().list(function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			save: function() {
				var d = $q.defer();

				PUser().save(function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			update: function(puser, params) {
				var d = $q.defer();

				PUser().update(puser, JSON.stringify(params), function(response) {
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise
			},
			updateFriends: function(friend) {
				var d = $q.defer(),
					currentUser = me.currentUser;

				PUser().updateFriends({
					objectId: currentUser.puserId,
					friends: friend
				}, function(response) {
					currentUser.friends = response.friends;
					d.resolve(response);
				}, function(error) {
					d.reject(error)
				});
				return d.promise;
			},
			setCurrentUser: function(user) {
				me.currentUser = user;
			},
			getCurrentUser: function() {
				return me.currentUser;
			}
		}
	}
})();
