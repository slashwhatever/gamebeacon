(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Image', Image);

	Image.$inject = ['$resource', '$q', 'appConfig'];

	function Image($resource, $q, appConfig) {
		var me = this,
			Image = $resource(appConfig.parseRestBaseUrl + 'files/:fileName', {
				fileName: '@fileName'
			}, {
				upload: {
					method: 'POST',
					params: {
						image: '@image'
					},
					headers: _.extend({
						'Content-Type': 'image/jpeg'
					}, appConfig.parseHttpsHeaders)
				}
			});

		return {
			upload: function(image) {

				var d = $q.defer(),
					image = Image.upload({
						fileName: image.replace(/^.*[\\\/]/, ''),
						image: image
					}, function(response) {
						d.resolve(response);
					}, function(error) {
						d.reject(error);
					});

				return d.promise;
			}
		}
	}
})();