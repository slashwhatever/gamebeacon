angular.module('gamebeacon.shared.directives', [])

.directive('headerShrink', function($document) {
	var fadeAmt;

	var shrink = function(header, content, amt, max) {
		amt = Math.min(44, amt);
		fadeAmt = 1 - amt / 44;
		ionic.requestAnimationFrame(function() {
			header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
			for (var i = 0, j = header.children.length; i < j; i++) {
				header.children[i].style.opacity = fadeAmt;
			}
		});
	};

	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {
			var starty = $scope.$eval($attr.headerShrink) || 0;
			var shrinkAmt;

			var header = $document[0].body.querySelector('.bar-header');
			var headerHeight = header.offsetHeight;

			$element.bind('scroll', function(e) {
				var scrollTop = null;
				if (e.detail) {
					scrollTop = e.detail.scrollTop;
				} else if (e.target) {
					scrollTop = e.target.scrollTop;
				}
				if (scrollTop > starty) {
					// Start shrinking
					shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
					shrink(header, $element[0], shrinkAmt, headerHeight);
				} else {
					shrink(header, $element[0], 0, headerHeight);
				}
			});
		}
	}
})

.directive("compareTo", function() {
	return {
		require: "ngModel",
		scope: {
			otherModelValue: "=compareTo"
		},
		link: function(scope, element, attributes, ngModel) {

			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue == scope.otherModelValue;
			};

			scope.$watch("otherModelValue", function() {
				ngModel.$validate();
			});
		}
	};
})

.directive('ionProfilePicture', [
	'$ionicTemplateLoader',
	'$ionicBackdrop',
	'$q',
	'$timeout',
	'$rootScope',
	'$document',
	function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document) {
		return {
			require: '?ngModel',
			restrict: 'E',
			template: '<div class="ion-profile-picture no-picture"><input type="file" accept="image/*" capture /></div>',
			replace: true,
			link: function(scope, element, attrs, ngModel) {
				var $input = angular.element(element.find('input'));
				var file = undefined;

				if (!ngModel) {
					console.error('ion-profile-picture:', 'Need to set ng-model');
					return false;
				}

				// all this guy does is trigger a click event on the hidden file input
				var openFileDialog = function(e) {
					$input[0].click();
				};

				// every time the file gets updated, this guy does it's thing
				var onFilePick = function(e) {
					var reader = new FileReader();

					reader.onload = function(_e) {
						scope.$apply(function() {
							ngModel.$setViewValue(_e.target.result);
							ngModel.$render();
						})
					};

					file = e.target.files[0];

					if (file) {
						// we read the data from our selected image to get the Base64
						// and use it as our element background
						reader.readAsDataURL(file);
					}
				};

				ngModel.$formatters.unshift(function(modelValue) {
					if (!modelValue) return '';
					return modelValue;
				});

				ngModel.$parsers.unshift(function(viewValue) {
					return viewValue;
				});

				ngModel.$render = function() {
					var value = ngModel.$viewValue;

					if (!value) {
						element.css({
							'background-image': 'none'
						});
						element.addClass('no-picture');
					} else {
						// if our value is just a plain Base64 string, we will try
						// to be helpful and prepend the right stuff to it
						if (!value.match(/^data:.*?;base64,/i)) {
							value = 'data:image/jpg;base64,' + value;
						}

						element.css({
							'background-image': 'url(' + value + ')'
						});
						element.removeClass('no-picture');
					}
				};

				element.on('click', openFileDialog);
				element.on('tap', openFileDialog);
				$input.on('change', onFilePick);
			}
		};
	}
])

.directive('beaconProfilePicture', [
	'$cordovaCamera',
	'$q',
	'$timeout',
	'$rootScope',
	'$ionicGesture',
	'$ionicActionSheet',
	function($cordovaCamera, $q, $timeout, $rootScope, $ionicGesture, $ionicActionSheet) {
		return {
			require: '?ngModel',
			restrict: 'E',
			template: '<div class="ion-profile-picture no-picture"><input type="file" accept="image/*" /></div>',
			replace: true,
			link: function(scope, element, attrs, ngModel) {
				var $input = angular.element(element.find('input'));
				var file = undefined;

				if (!ngModel) {
					console.error('ion-profile-picture:', 'Need to set ng-model');
					return false;
				}

				var options = {
					destinationType: Camera.DestinationType.FILE_URI,
					encodingType: Camera.EncodingType.JPEG,
					allowEdit: true,
					cameraDirection: 1,
					saveToPhotoAlbum: true,
					width: 500,
					height: 500,
					quality: 80
				};

				picImageSrc = function() {

					// Show the action sheet
					var hideSheet = $ionicActionSheet.show({
						buttons: [{
							text: 'Camera'
						}, {
							text: 'Photo Library'
						}],
						titleText: 'Where from?',
						cancelText: 'Cancel',
						cancel: function() {
							// add cancel code..
						},
						buttonClicked: function(index) {
							switch (index) {
								case 0:
									options.sourceType = Camera.PictureSourceType.CAMERA
									break;
								case 1:
									options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY
									break;
							}

							$cordovaCamera.getPicture(options).then(function(imageUri) {
								ngModel.$setViewValue(imageUri);
								ngModel.$render();
							}, function(err) {
								// error
							});

							return true
						}
					});
				}

				ngModel.$formatters.unshift(function(modelValue) {
					if (!modelValue) return '';
					return modelValue;
				});

				ngModel.$parsers.unshift(function(viewValue) {
					return viewValue;
				});

				ngModel.$render = function() {
					var value = ngModel.$viewValue;

					if (!value) {
						element.css({
							'background-image': 'none'
						});
						element.addClass('no-picture');
					} else {
						element.css({
							'background-image': 'url(' + value + ')'
						});
						element.removeClass('no-picture');
					}
				};

				$ionicGesture.on('tap', picImageSrc, element);
			}
		};
	}
])
