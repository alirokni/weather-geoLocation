"use strict";
myGeoLocationApp.initialCityWeatherReport();

// on dom ready main functions
$(function () {
  $('#js-geo-btn').on('click', myGeoLocationApp.findMyLocationWeather);
  $('#js-geo-search').on('click', myGeoLocationApp.searchLocationEnter);
  var setMessageTimerMain = new myGeoLocationApp.SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
  setMessageTimerMain.showMessage();
});
