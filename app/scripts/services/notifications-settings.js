'use strict';

angular.module('groupeat.services.notifications-settings', ['ngResource'])

.factory('notificationsSettings', function() {

  var settings = {
		pushActivation : true,
		dontPushAfter : 4,
		dontPushFor : 6,
	};

  var pivotTableSettings = {
		dontPushAfter:[
			{name: '21h00', id:0},
			{name: '22h00', id:1},
			{name: '23h00', id:2},
			{name: '00h00', id:3},
			{name: '1h00', id:4}
		],

		dontPushFor: [
			{name: '1 jour', id:0},
			{name: '2 jours', id:1},
			{name: '3 jours', id:2},
			{name: '4 jours', id:3},
			{name: '5 jours', id:4},
			{name: '6 jours', id:5},
			{name: '1 semaine', id:6}
		]
  };

  var saveSettings = function(newsettings) {
	//newsettings should look like
		if(
		typeof newsettings.pushActivation === 'boolean' &&
		typeof newsettings.dontPushFor === 'number' &&
		newsettings.dontPushFor < pivotTableSettings.dontPushFor.length &&
		typeof newsettings.dontPushAfter === 'number' &&
		newsettings.dontPushAfter < pivotTableSettings.dontPushAfter.length
		)
		{
			settings.pushActivation = newsettings.pushActivation;
			settings.dontPushFor = pivotTableSettings.dontPushFor[newsettings.dontPushFor];
			settings.dontPushAfter = pivotTableSettings.dontPushAfter[newsettings.dontPushAfter];
	//send newsettings to backend
		}
  };
  return {
		saveSettings : saveSettings,
		settings : settings,
		pivotTableSettings : pivotTableSettings
  } ;
});
