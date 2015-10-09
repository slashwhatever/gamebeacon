(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('UI', UI);

	UI.$inject = ['appConfig', '$ionicPopup', '$rootScope', '$ionicLoading'];

	function UI(appConfig, $ionicPopup, $rootScope, $ionicLoading) {
		return {
			showAlert: function(opts, cb) {

				// hide any existing loading message first
				$ionicLoading.hide();

				var options = {},
					defs = {
						cssClass: 'gb-popup'
					};

					options = _.extend(opts, defs);

				$ionicPopup.alert(options).then(cb);
			},
			showToast: function(opts) {
				var defs = {
					template: '<div class="loading-spinner"><ion-spinner class="{{cls}}" icon="{{spinner}}"></ion-spinner><span>{{msg}}</span></div>',
					spinner: 'crescent',
					cls: 'spinner-energized',
					msg: 'loading...'
				};

				_.extend(defs, opts);

				defs.template = defs.template.replace('{{spinner}}', defs.spinner);
				defs.template = defs.template.replace('{{msg}}', defs.msg);
				defs.template = defs.template.replace('{{cls}}', defs.cls);

				// hide any existing message so you can just show one after the other
				$ionicLoading.hide();
				$ionicLoading.show(defs);
			},
			hideToast: function() {
				$ionicLoading.hide()
			}
		}
	}
})();