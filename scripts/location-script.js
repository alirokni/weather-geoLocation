'use strict';
// Immediately-Invoked Function Expression (IIFE) of weather report
(function intialCityWeatherReport() {
    var intialCity = 'Paris';
    searchGetLocation(intialCity);
})();

// on dom ready main functions
$(function() {
    $('#js-geo-btn').on('click', findMyLocationWeather);
    $('#js-geo-search').on('click', searchLocationEnter);
    var setMessageTimerMain = new SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
    setMessageTimerMain.showMessage();
});

// html5 geo location function to access geographical location information of hosting device
function findMyLocationWeather() {
    var $latitude, $longitude;
    // check if browser supports geo location and get coordination, else call search by city name function
    if (!navigator.geolocation) {
        $('#js-container-message').text('Your browser is not supporting html5 geo location.\nA Please use Search for your location.').addClass('container-message bg-danger');
    } else {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
        $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
        $('.information .js-geolocation-note').addClass('bg-warning');
        var setMessageTimerFind = new SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
        setMessageTimerFind.showMessage();
    }

    // on success, get and display the corrodincations and call openWeatherApi using latitude and longitude
    function geoSuccess(position) {
        $latitude = (position.coords.latitude).toFixed(3);
        $longitude = (position.coords.longitude).toFixed(3);
        $('#js-lat').text($latitude);
        $('#js-lon').text($longitude);
        $('#js-acc').text(position.coords.accuracy);
        findLocationCoordination($latitude, $longitude);
    }

    // on failure of permission denied, show an error message. On other errors call search function
    function geoFail(error) {
        var errorMessage = '';
        if (error.code === 1) { //  geoError = { 1: 'PERMISSION DENIED', 2: 'POSITION UNAVAILABLE', 3: 'TIMEOUT' };
            errorMessage = error.message + '. Please \'Allow\' use of your computer location on browser\'s address bar and reload this page.';
            $('#js-container-message').text(errorMessage).addClass('container-message bg-danger');
            $('.information .js-geolocation-note').addClass('bg-warning');
            var setMessageTimerFail = new SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
            setMessageTimerFail.showMessage();
        } else {
            $('#js-container-search').removeClass('hidden');
            searchLocationEnter();
        }
    }
}

// helper function for accessing geo location coordination and passing it to openWeatherApi
function findLocationCoordination($latitude, $longitude) {
    searchGetLocation('', $latitude, $longitude);
    $('#js-container-report').addClass('bg-success');
    $('#js-location-list').removeClass('hidden');
}

// Get the search query if it is entered and passing it to openWeatherApi
function searchLocationEnter() {
    var $serachVal = $('#js-location-serach').val();
    $('#js-location-list').addClass('hidden');
    if (!!$serachVal.length) {
        searchGetLocation($serachVal);
        $('#js-container-report').addClass('bg-success');
    }
}

// helper function to build weather query paramter
function accessLocation(cityName, $latitude, $longitude) {
    var weatherParam;
    if (cityName) {
        weatherParam = 'q=' + cityName;
    } else {
        weatherParam = '&lat=' + $latitude + '&lon=' + $longitude;
    }
    $('#js-container-report').addClass('bg-success');
    return weatherParam;
}

/*
helper functions for temperature conversion from Kelvin to Farhrenheit and
date Conversion from Epoch - Unix Timestamp Converter to o regular dates
rapidtables.com/convert/temperature/index.htm
epochconverter.com/
*/

var TemperatureConversion = function(_temperature) {
    var temp = _temperature;
    this.doFahrenheitConversion = function() { //public T(K) × 9/5 - 459.67
        return ((temp * 9 / 5) - 459.67).toFixed(1);
    };
    this.doCelsiusConversion = function() { //public T(°C) = T(K) - 273.15
        return (temp - 273.15).toFixed(1);
    };

}

var DateConversion = function(_timeStamp) {
    var timeStamp = _timeStamp;
    this.doTimeConversion = function() { //public
        var myDate = new Date(timeStamp * 1000);
        return (myDate.toGMTString()).substring(0, 11);
    };
    this.dolocalTimeConversion = function() { //public
        var myDate = new Date(timeStamp * 1000);
        return (myDate.toLocaleString()).substring(0, 8);
    };
}

// helper function for showing messages in a timely fashion
var SetMessageTimer = function(_element, _className, _timer) {
    var element = _element; // private
    var className = _className; // private
    var timer = _timer; // private
    this.showMessage = function() { //public
        window.setTimeout(function() {
            $(element).removeClass(className);
        }, timer);
    };
};

var selectDegree = function(){
    $('#js-weather-temp-F').on('click',function(){
        $('.js-fahrenheit-temp').show();
        $('.js-celsius-temp').hide();
    });
    $('#js-weather-temp-C').on('click',function(){
        $('.js-fahrenheit-temp').hide();
        $('.js-celsius-temp').show();
    });
};

// helper for Ajax successHandler for weather report
function weatherReport(data) {
        var weather = data;
        var kelvinTemp = weather.main.temp;
        var toFahrenheit = new TemperatureConversion(kelvinTemp);
        var showUpdatedFahrenheitTemp = toFahrenheit.doFahrenheitConversion();

        var toCelsius = new TemperatureConversion(kelvinTemp);
        var showUpdatedCelsiusTemp = toCelsius.doCelsiusConversion();

        var dateObj = weather.dt;
        var toDate = new DateConversion(dateObj);
        var showUpdatedDate = toDate.dolocalTimeConversion();

        if (weather.cod !== '404') {
            $('#js-container-message').text('').removeClass('container-message bg-danger');
            $('.js-today-report').text(showUpdatedDate)
            $('#js-city').text(weather.name);
            $('#js-country').text(weather.sys.country);
            $('#js-weather-description').text(weather.weather[0].description);
            $('#js-weather-main').text();
            $('#js-weather-temp-F').html(showUpdatedFahrenheitTemp + " <span class='js-f-d f-d mute'>&deg;F</span>");
            $('#js-weather-temp-C').html(showUpdatedCelsiusTemp + " <span class='js-c-d c-d'>&deg;C</span>");
            $('#js-img-icon').prop('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
            $('#js-container-report').removeClass('hidden');
        } else {
            $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
            var setMessageTimerCall = new SetMessageTimer('#js-container-report', 'bg-success', 3000);
            setMessageTimerCall.showMessage();
        }
    
    getDisplayedDegree();
    
    }

// helper for displaying selecetd degree
var getDisplayedDegree = function() {
    $('.js-c-d.c-d').on('click', function(){
        if( $('.js-f-d.f-d').hasClass('mute') ) {
            $('.js-c-d.c-d').addClass('mute');
            $('.js-f-d.f-d').removeClass('mute');
            $('.js-celsius-temp').addClass('bg-info');
            var setMessageTimerCelsius = new SetMessageTimer('.js-celsius-temp', 'bg-info', 1000);
                setMessageTimerCelsius.showMessage();   
        }
    }) 

    $('.js-f-d.f-d').on('click', function(){
        if( $('.js-c-d.c-d').hasClass('mute') ) {
            $('.js-f-d.f-d').addClass('mute');
            $('.js-c-d.c-d').removeClass('mute');
            $('.js-fahrenheit-temp').addClass('bg-info');
            var setMessageTimerFahrenheit = new SetMessageTimer('.js-fahrenheit-temp', 'bg-info', 1000);
            setMessageTimerFahrenheit.showMessage();
        }
    })
}


// helper for Ajax successHandler for weather forcast
function weatherForecastReport(data) {
    var weather = data;
    var listLen = weather.list.length;
    var htmlCode = '';
    if (weather.cod !== '404') {
        for (var i = 0; i < listLen; i++) {
            var weatherObj = weather.list[i].temp.day;
            var toFahrenheit = new TemperatureConversion(weatherObj);
            var showUpdatedFahrenheitTemp = toFahrenheit.doFahrenheitConversion();

            var toCelsius = new TemperatureConversion(weatherObj);
            var showUpdatedCelsiusTemp = toCelsius.doCelsiusConversion();

            var dateObj = weather.list[i].dt;
            var toDate = new DateConversion(dateObj);
            var showUpdatedDate = toDate.doTimeConversion();
            
            htmlCode = '<div class="forcast-report col-md-2"><div>' + showUpdatedDate + '</div>';
            htmlCode += '<img src="http://openweathermap.org/img/w/' + weather.list[i].weather[0].icon + '.png" />';
            htmlCode += '<span class="js-fahrenheit-temp fahrenheit-temp">' + showUpdatedFahrenheitTemp + '<sup>&deg;F</sup></span> ';
            htmlCode += '<span class="js-celsius-temp celsius-temp">' + showUpdatedCelsiusTemp + '<sup>&deg;C</sup></span>';
            htmlCode += '<div>' + weather.list[i].weather[0].description + '</div></div>';
            
            $('.js-forcast-container-report').append(htmlCode);
            selectDegree();
        }
        // To extend the border for the last
        $('.forcast-report').last().removeClass('col-md-2').addClass('col-md-4');
    } else {
        $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
        var setMessageTimerCall = new SetMessageTimer('#js-container-report', 'bg-success', 3000);
        setMessageTimerCall.showMessage();
    }
    drawTemperatureChart(weather);
}

// call openWeatherApi json data on success and display the result else show the error message
function searchGetLocation(cityName, $latitude, $longitude) {
    $('#js-location-serach').val('');
    $('.js-forcast-container-report').html('');
    $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
    // call for today weather
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://api.openweathermap.org/data/2.5/weather?APPID=Your-APP-ID',
        data: accessLocation(cityName, $latitude, $longitude),
        success: weatherReport,
        error: function(textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        }
    });
    // call for 5 day forcast
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?APPID=Your-APP-ID&cnt=5',
        data: accessLocation(cityName, $latitude, $longitude),
        success: weatherForecastReport,
        error: function(textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        }
    });

}


function drawTemperatureChart(weather) {
    var dateNuObj = [];
    var faTempArr = [];
    var CeTempArr = [];
    
    for (var k = 0; k < weather.list.length; k++) {
        var _dateObj = weather.list[k].dt;
        var _klTempObj = weather.list[k].temp.day;
        
            var _toDate = new DateConversion(_dateObj);
            var _showUpdatedDate = _toDate.doTimeConversion();

            var _toFahrenheit = new TemperatureConversion(_klTempObj);
            var _showUpdatedFahrenheitTemp = _toFahrenheit.doFahrenheitConversion();
/*
            var toCelsius = new TemperatureConversion(kelvinTemp);
            var showUpdatedCelsiusTemp = toCelsius.doCelsiusConversion();
*/
        faTempArr.push(parseFloat(_showUpdatedFahrenheitTemp));
        dateNuObj.push(_showUpdatedDate);
 
    }
    $('#container').highcharts({
        title: {
            text: weather.city.name + ' Daily Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: openweathermap.org',
            x: -20
        },
        xAxis: {
            categories: dateNuObj // Five days
        },
        yAxis: {
            title: {
                text: 'Temperature (°F)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°F'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: weather.city.name,
            data: faTempArr
        }]
    });
};
