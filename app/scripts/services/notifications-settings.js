'use strict';

angular.module('groupeat.services.notifications-settings', ['ngResource'])

.factory('NotificationsSettings', function() {
  // settings = $resource(ENV.apiEndpoint+'/notifications-settings')

  //get settings from backend
  var settingsLabel = {
		pushActivation : true,
		dontPushAfter : '00:00+01:00',
		dontPushFor : 5,
	};



  var pivotTableSettings = {
		dontPushAfter:[
			{name: '21h00', id:0, label:'21:00+01:00'},
			{name: '22h00', id:1, label:'22:00+01:00'},
			{name: '23h00', id:2, label:'23:00+01:00'},
			{name: '00h00', id:3, label:'00:00+01:00'},
			{name: '1h00', id:4, label:'01:00+01:00'}
		],

		dontPushFor: [
			{name: '1 jour', id:0, label:1},
			{name: '2 jours', id:1, label:2},
			{name: '3 jours', id:2, label:3},
			{name: '4 jours', id:3, label:4},
			{name: '5 jours', id:4, label:5},
			{name: '6 jours', id:5, label:6},
			{name: '1 semaine', id:6, label:7}
		]
  };

  //get settings ID for view
  var settings = {
		pushActivation : true,
		dontPushAfter : 0,
		dontPushFor : 0,
	};

  pivotTableSettings.dontPushAfter.forEach(function(element,index){
		if(element.label===settingsLabel.dontPushAfter)
			{settings.dontPushAfter=index;}
  });

  pivotTableSettings.dontPushFor.forEach(function(element,index){
		if(element.label===settingsLabel.dontPushFor)
			{settings.dontPushFor=index;}
  });

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
			settings.dontPushFor = newsettings.dontPushFor;
			settings.dontPushAfter = newsettings.dontPushAfter;
			settingsLabel.pushActivation = newsettings.pushActivation;
			settingsLabel.dontPushFor = pivotTableSettings.dontPushFor[newsettings.dontPushFor].label;
			settingsLabel.dontPushAfter = pivotTableSettings.dontPushAfter[newsettings.dontPushAfter].label;
	//send newsettings to backend
		}
  };
  return {
		saveSettings : saveSettings,
		settings : settings,
		settingsLabel : settingsLabel,
		pivotTableSettings : pivotTableSettings
  } ;
});
