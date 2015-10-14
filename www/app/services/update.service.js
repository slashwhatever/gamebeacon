(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Update', Update);

	Update.$inject = ['$ionicPopup', '$ionicDeploy', 'UI', '$localStorage'];

	function Update($ionicPopup, $ionicDeploy, UI, $localStorage) {

		return {
			checkForUpdates : checkForUpdates
		}

		function checkForUpdates() {

			UI.showToast({
				msg: 'checking for updates...'
			});

			// Check for updates
			$ionicDeploy.check().then(function(response) {
				UI.hideToast();
				// response will be true/false
				if (response) {
					var confirmUpdate = $ionicPopup.confirm({
						cssClass: 'fade-up',
						title: 'Update available',
						template: 'Would you like to download and install the latest version of gamebeacon?'
					});
					confirmUpdate.then(function(res) {
						if (res) doUpdate();
					})
				}
			}, function(error) {
				UI.hideToast();
			});
		}

		// Update app code with new release from Ionic Deploy
		function doUpdate() {
			// Download the updates
			UI.showToast({
				msg: 'downloading update...'
			});

			$ionicDeploy.download().then(function() {
				// Extract the updates
				UI.showToast({
					msg: 'extracting update...'
				});

				$ionicDeploy.extract().then(function() {
					// Load the updated version
					UI.showToast({
						msg: 'loading update...'
					});
					$ionicDeploy.load();
				}, function(error) {
					UI.showAlert({
						title: 'Oops!',
						template: 'Error extracting update. Please try again.'
					})
				}, function(progress) {
					// Do something with the zip extraction progress
					console.log(progress);
				});
			}, function(error) {
				UI.showAlert({
					title: 'Oops!',
					template: 'Error downloading update. Please try again.'
				})
			}, function(progress) {
				// Do something with the download progress
				console.log(progress);
			});
		};

	}
})();