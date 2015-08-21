angular.module('gamebeacon.chat.services', ['ngResource', 'gamebeacon.config'])

.factory('ChatService', ['$rootScope', '$resource', '$q', 'appConfig', 'UtilsService', function($rootScope, $resource, $q, appConfig, UtilsService) {

	var Chat = $resource(
		appConfig.parseRestBaseUrl + 'classes/messages/:id', {
			id: '@id',
			where: '@where'
		}, {
			get: {
				headers: appConfig.parseHttpsHeaders
			},
			list: {
				method: 'GET',
				params: {
					'where': '@where',
					'order': '-createdAt',
					'include': 'from,to,mission,createdAt'
				},
				headers: appConfig.parseHttpsHeaders
			},
			save: {
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			},
			update: {
				method: 'PUT',
				headers: appConfig.parseHttpsHeaders
			}
		})

	return {
		list: function(beaconId) {
			var d = $q.defer();
			Chat.list({where: '{"beacon":{"__type":"Pointer","className":"beacons","objectId":"' + beaconId + '"}}'}, function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		get: function(id) {
			var d = $q.defer();
			Chat.get({id: id}, function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		save: function(message, beaconId) {
			var d = $q.defer();
			Chat.save({
				message: message,
				beacon: UtilsService.getObjectAsPointer('beacons', beaconId),
				from: UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.puserId)
			}, function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		},
		update: function(message) {
			var d = $q.defer();
			Chat.update({message: message}, {id: id}, function(response) {
				d.resolve(response);
			}, function(error){
				d.reject(error)
			});
			return d.promise
		}
	}
}])