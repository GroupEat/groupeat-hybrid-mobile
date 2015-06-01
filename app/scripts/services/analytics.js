'use strict';

angular.module('groupeat.services.analytics', [])

/*global analytics:true*/
.factory('Analytics', function () {

  var
  /**
  * @ngdoc function
  * @name Analytics#startTrackerWithId
  * @methodOf Analytics
  *
  * @description
  * Starts tracking the application
  *
  */
  startTrackerWithId = function(analyticsId) {
    if (typeof analytics !== 'undefined')
    {
      analytics.startTrackerWithId(analyticsId);
    }
    else
    {
      console.log('Google Analytics Unavailable');
    }
  },

  /**
  * @ngdoc function
  * @name Analytics#trackEvent
  * @methodOf Analytics
  *
  * @description
  * Tracks an event triggered by the customer
  * Label and Value are optional, Value is numeric
  *
  */
  trackEvent = function(category, action, label, value) {
    if (typeof analytics !== 'undefined')
    {
      analytics.trackEvent(category, action, label, value);
    }
  },

  trackTimingSinceTime = function(category, initialTime, variable, label) {
    if (typeof analytics !== 'undefined')
    {
      var d = new Date();
      analytics.trackTiming(category, d.getTime()-initialTime, variable, label);
    }
  },

  /**
  * @ngdoc function
  * @name Analytics#trackView
  * @methodOf Analytics
  *
  * @description
  * Tracks a view visited by the customer
  *
  */
  trackView = function (viewName) {
    if (typeof analytics !== 'undefined')
    {
      analytics.trackView(viewName);
    }
  };

  return {
    startTrackerWithId: startTrackerWithId,
    trackEvent: trackEvent,
    trackTimingSinceTime: trackTimingSinceTime,
    trackView: trackView
  };
}
);
