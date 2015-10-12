angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("app/components/beacon/cardList/cardListView.html","<ion-list show-delete=\"false\" show-reorder=\"false\" can-swipe=\"beacons.length > 0\">\n	<ion-item class=\"beacon-card\" ui-sref=\"beacon-create\">\n		<div class=\"beacon-list-empty\">\n			<p class=\"icon ion-plus-round\">Tap to create a new beacon</p>\n		</div>\n		</div>\n	</ion-item>\n	<ion-item class=\"beacon-card\" ui-sref=\"app.beacon({beaconId: beacon.objectId})\" ng-class=\"{\'my-beacon\' : beacon.userIsCreator }\" ng-repeat=\"beacon in beacons track by beacon.objectId\">\n		<beacon-header></beacon-header>\n		<beacon-meta></beacon-meta>\n		<!-- <beacon-actions></beacon-actions> -->\n		<beacon-timer ng-if=\"beacon.active\" beacon=\"beacon\"></beacon-timer>\n		<ion-option-button ng-if=\"beacon.userIsCreator\" class=\"button-assertive\"><i class=\"icon ion-android-delete\"></i>Delete</ion-option-button>\n	</ion-item>\n</ion-list>\n");
$templateCache.put("app/components/beacon/chat/chatView.html","<div>\n    <div ng-repeat=\"message in messages | orderBy: \'-createdAt\'\">\n			<div class=\"row\">\n				<div class=\"col-80\" ng-class=\"{\'col-offset-20\' : message.from.objectId == currentUser.puserId }\">\n				  <div class=\"message-timestamp\" ng-class=\"{\'your-msg-timestamp\': message.from.objectId == currentUser.puserId, \'their-msg-timestamp\': message.from.objectId != currentUser.puserId}\" >\n				    <span am-time-ago=\"message.createdAt\"></span>\n				  </div>\n				</div>\n			</div>\n\n      <div class=\"row\">\n\n        <div class=\"col-80\" ng-class=\"{\'col-offset-20\' : message.from.objectId == currentUser.puserId }\">\n          <div class=\"message\" ng-class=\"{\'your-msg\': message.from.objectId == currentUser.puserId, \'their-msg\': message.from.objectId != currentUser.puserId, \'owner-msg\': message.from.objectId == beacon.creator.objectId}\" >\n            <div class=\"message-left message-icon\" ng-if=\"message.from.objectId != currentUser.puserId\" ng-class=\"{\'ion-ios-chatbubble\' : message.from.objectId == beacon.creator.objectId, \'ion-ios-chatbubble-outline\' : message.from.objectId != beacon.creator.objectId}\"></div>\n            <div class=\"message-body\"><span class=\"message-username\">{{message.from.gamertag}}:</span> {{message.message}}</div>\n            <div class=\"message-right message-icon\" ng-if=\"message.from.objectId == currentUser.puserId\" ng-class=\"{\'ion-ios-chatbubble\' : message.from.objectId == beacon.creator.objectId, \'ion-ios-chatbubble-outline\' : message.from.objectId != beacon.creator.objectId}\"></div>\n          </div>\n        </div>\n\n      </div>\n    </div>\n\n</div>\n");
$templateCache.put("app/components/beacon/fireteam/fireteam.html","<div class=\"row\">\n    <div class=\"col\">\n\n        <!-- admins can kick everyone but themselves -->\n        <button ng-repeat=\"guardian in fireteam\" ng-class=\"{\'fireteam-leader\' : beacon.creator.objectId == guardian.objectId}\" class=\"fireteam-button animate-repeat button-block\" ng-click=\"guardianAction({beacon:beacon, objectId: guardian.objectId})\" ng-disabled=\"!beacon.userIsCreator || (beacon.creator.objectId == guardian.objectId)\">\n            <span>{{ guardian.gamertag | limitTo : 10}}</span>\n        </button>\n\n    </div>\n\n</div>\n");}]);