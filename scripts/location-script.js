"use strict";
var myGeoLocationApp = myGeoLocationApp || (function () {
    // Initial weather report function
    var initialCityWeatherReport = function () {
            var initialCity = 'Paris';
            _searchGetLocation(initialCity)
        },
        // call openWeatherApi json data on success and display the result else show the error message
        _searchGetLocation = function (cityName, $latitude, $longitude) {
            $('#js-location-search').val('');
            $('.js-forecast-container-report').html('');
            $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
            var n = 0;
            while (n <= 1) {
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: _getUrl(n),
                    data: _accessLocation(cityName, $latitude, $longitude),
                    success: _doTheReport(n),
                    error: function (textStatus, error) {
                        var err = textStatus + ', ' + error;
                        console.log('Request Failed: ' + err)
                    }
                });
                n++
            }
        },
        // helper function to build the url
        _getUrl = function (n) {
            var appId = 'Your-APP-ID',
                baseUrl = 'http://api.openweathermap.org/data/2.5/',
                weatherUrl = 'weather?APPID=' + appId,
                forecastUrl = 'forecast/daily?cnt=5&APPID=' + appId;
            if (n == 0) {
                return baseUrl + weatherUrl
            } else {
                return baseUrl + forecastUrl
            }
        },
        // helper function to build weather query paramter
        _accessLocation = function (cityName, $latitude, $longitude) {
            var weatherParam;
            if (cityName) {
                weatherParam = 'q=' + cityName
            } else {
                weatherParam = '&lat=' + $latitude + '&lon=' + $longitude
            }
            $('#js-container-report').addClass('bg-success');
            return weatherParam
        },
        // helper function to build weather report
        _doTheReport = function (n) {
            if (n == 0) {
                return _weatherReport
            } else {
                return _weatherForecastReport
            }
        },
        // helper function for Ajax successHandler for weather report
        _weatherReport = function (data) {
            var weather = data,
                kelvinTemp = weather.main.temp,
                toFahrenheit = new _TemperatureConversion(kelvinTemp),
                showUpdatedFahrenheitTemp = toFahrenheit.doFahrenheitConversion(),
                toCelsius = new _TemperatureConversion(kelvinTemp),
                showUpdatedCelsiusTemp = toCelsius.doCelsiusConversion(),
                dateObj = weather.dt,
                toDate = new _DateConversion(dateObj),
                showUpdatedDate = toDate.dolocalTimeConversion();
            if (weather.cod !== '404') {
                $('#js-container-message').text('').removeClass('container-message bg-danger');
                $('.js-today-report').text(showUpdatedDate);
                $('#js-city').text(weather.name);
                $('#js-country').text(weather.sys.country);
                $('#js-weather-description').text(weather.weather[0].description);
                $('#js-weather-main').text();
                $('#js-weather-temp-F').html(showUpdatedFahrenheitTemp + " <span class='js-f-d f-d mute'>&deg;F</span>");
                $('#js-weather-temp-C').html(showUpdatedCelsiusTemp + " <span class='js-c-d c-d'>&deg;C</span>");
                $('#js-img-icon').prop('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
                $('#js-container-report').removeClass('hidden')
            } else {
                $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
                var setMessageTimerCall = new SetMessageTimer('#js-container-report', 'bg-success', 3000);
                setMessageTimerCall.showMessage()
            }
            _getDisplayedDegree()
        },
        // helper for displaying selecetd degree
        _getDisplayedDegree = function () {
            $('.js-c-d.c-d').on('click', function () {
                if ($('.js-f-d.f-d').hasClass('mute')) {
                    $('.js-c-d.c-d').addClass('mute');
                    $('.js-f-d.f-d').removeClass('mute');
                    $('.js-celsius-temp').addClass('bg-info');
                    var setMessageTimerCelsius = new SetMessageTimer('.js-celsius-temp', 'bg-info', 1000);
                    setMessageTimerCelsius.showMessage()
                }
            });
            $('.js-f-d.f-d').on('click', function () {
                if ($('.js-c-d.c-d').hasClass('mute')) {
                    $('.js-f-d.f-d').addClass('mute');
                    $('.js-c-d.c-d').removeClass('mute');
                    $('.js-fahrenheit-temp').addClass('bg-info');
                    var setMessageTimerFahrenheit = new SetMessageTimer('.js-fahrenheit-temp', 'bg-info', 1000);
                    setMessageTimerFahrenheit.showMessage()
                }
            })
        },
        // helper for Ajax successHandler for weather forecast
        _weatherForecastReport = function (data) {
            var weather = data,
                listLen = weather.list.length,
                htmlCode = '';
            if (weather.cod !== '404') {
                for (var i = 0; i < listLen; i++) {
                    var weatherObj = weather.list[i].temp.day,
                        toFahrenheit = new _TemperatureConversion(weatherObj),
                        showUpdatedFahrenheitTemp = toFahrenheit.doFahrenheitConversion(),
                        toCelsius = new _TemperatureConversion(weatherObj),
                        showUpdatedCelsiusTemp = toCelsius.doCelsiusConversion(),
                        dateObj = weather.list[i].dt,
                        toDate = new _DateConversion(dateObj),
                        showUpdatedDate = toDate.doTimeConversion();
                    htmlCode = '<div class="forecast-report col-md-2"><div>' + showUpdatedDate + '</div>';
                    htmlCode += '<img src="http://openweathermap.org/img/w/' + weather.list[i].weather[0].icon + '.png" />';
                    htmlCode += '<span class="js-fahrenheit-temp fahrenheit-temp">' + showUpdatedFahrenheitTemp + '<sup>&deg;F</sup></span> ';
                    htmlCode += '<span class="js-celsius-temp celsius-temp">' + showUpdatedCelsiusTemp + '<sup>&deg;C</sup></span>';
                    htmlCode += '<div>' + weather.list[i].weather[0].description + '</div></div>';
                    $('.js-forecast-container-report').append(htmlCode);
                    _selectDegree()
                }
                $('.forecast-report').last().removeClass('col-md-2').addClass('col-md-4')
            } else {
                $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
                var setMessageTimerCall = new SetMessageTimer('#js-container-report', 'bg-success', 3000);
                setMessageTimerCall.showMessage()
            }
            _drawTemperatureChart(weather)
        },
        // html5 geo location function to access geographical location information of hosting device
        findMyLocationWeather = function () {
            // check if browser supports geo location and get coordination, else call search by city name function
            if (!navigator.geolocation) {
                $('#js-container-message').text('Your browser is not supporting html5 geo location.\nA Please use Search for your location.').addClass('container-message bg-danger')
            } else {
                navigator.geolocation.getCurrentPosition(_geoSuccess, _geoFail);
                $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
                $('.information .js-geolocation-note').addClass('bg-warning');
                var setMessageTimerFind = new SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
                setMessageTimerFind.showMessage()
            }
        },
        // on success, get and display the corrodincations and call openWeatherApi using latitude and longitude
        _geoSuccess = function (position) {
            var $latitude, $longitude;
            $latitude = (position.coords.latitude).toFixed(3);
            $longitude = (position.coords.longitude).toFixed(3);
            $('#js-lat').text($latitude);
            $('#js-lon').text($longitude);
            $('#js-acc').text(position.coords.accuracy);
            _findLocationCoordination($latitude, $longitude)
        },
        // on failure of permission denied, show an error message. On other errors call search function
        _geoFail = function (error) { //  geoError = { 1: 'PERMISSION DENIED', 2: 'POSITION UNAVAILABLE', 3: 'TIMEOUT' };
            var errorMessage = '';
            if (error.code === 1) {
                errorMessage = error.message + '. Please \'Allow\' use of your computer location on browser\'s address bar and reload this page.';
                $('#js-container-message').text(errorMessage).addClass('container-message bg-danger');
                $('.information .js-geolocation-note').addClass('bg-warning');
                var setMessageTimerFail = new SetMessageTimer('.information .js-geolocation-note', 'bg-warning', 3000);
                setMessageTimerFail.showMessage()
            } else {
                $('#js-container-search').removeClass('hidden');
                searchLocationEnter()
            }
        },
        // helper function for accessing geo location coordination and passing it to openWeatherApi
        _findLocationCoordination = function ($latitude, $longitude) {
            _searchGetLocation('', $latitude, $longitude);
            $('#js-container-report').addClass('bg-success');
            $('#js-location-list').removeClass('hidden')
        },
        // Get the search query if it is entered and passing it to openWeatherApi
        searchLocationEnter = function () {
            var $serachVal = $('#js-location-search').val();
            $('#js-location-list').addClass('hidden');
            if (!!$serachVal.length) {
                _searchGetLocation($serachVal);
                $('#js-container-report').addClass('bg-success')
            } else {
                console.log('Nothing was entered in Search Box')
            }
        },
        /*
        helper functions for temperature conversion from Kelvin to Farhrenheit and
        date Conversion from Epoch - Unix Timestamp Converter to o regular dates
        rapidtables.com/convert/temperature/index.htm
        epochconverter.com/
        */
        _TemperatureConversion = function (temperature) {
            var _temp = temperature;
            this.doFahrenheitConversion = function () { //privileged method T(K) × 9/5 - 459.67
                return ((_temp * 9 / 5) - 459.67).toFixed(1)
            };
            this.doCelsiusConversion = function () { //privileged method T(°C) = T(K) - 273.15
                return (_temp - 273.15).toFixed(1)
            }
        },
        _DateConversion = function (timeStamp) {
            var _timeStamp = timeStamp;
            this.doTimeConversion = function () { //privileged method
                var myDate = new Date(_timeStamp * 1000);
                return (myDate.toGMTString()).substring(0, 11)
            };
            this.dolocalTimeConversion = function () { //privileged method
                var myDate = new Date(_timeStamp * 1000);
                return (myDate.toLocaleString()).substring(0, 8)
            }
        },
        // helper function for showing messages in a timely fashion
        SetMessageTimer = function (element, className, timer) {
            var _element = element,
                _className = className,
                _timer = timer; // private
            this.showMessage = function () { //privileged method
                window.setTimeout(function () {
                    $(_element).removeClass(_className)
                }, _timer)
            }
        },
        _selectDegree = function () {
            $('#js-weather-temp-F').on('click', function () {
                $('.js-fahrenheit-temp').show();
                $('.js-celsius-temp').hide()
            });
            $('#js-weather-temp-C').on('click', function () {
                $('.js-fahrenheit-temp').hide();
                $('.js-celsius-temp').show()
            })
        },
        _drawTemperatureChart = function (weather) {
            var dateNuObj = [],
                faTempArr = [];
            for (var k = 0; k < weather.list.length; k++) {
                var _dateObj = weather.list[k].dt,
                    _klTempObj = weather.list[k].temp.day,
                    _toDate = new _DateConversion(_dateObj),
                    _showUpdatedDate = _toDate.doTimeConversion(),
                    _toFahrenheit = new _TemperatureConversion(_klTempObj),
                    _showUpdatedFahrenheitTemp = _toFahrenheit.doFahrenheitConversion();
                faTempArr.push(parseFloat(_showUpdatedFahrenheitTemp));
                dateNuObj.push(_showUpdatedDate)
            }
            $('#container').highcharts({
                title: {
                    text: weather.city.name + ' Daily Temperature',
                    x: -20 //center
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
            })
        }
        // public methods
    return {
        module: 'myGeoLocationApp',
        initialCityWeatherReport: initialCityWeatherReport,
        findMyLocationWeather: findMyLocationWeather,
        searchLocationEnter: searchLocationEnter,
        SetMessageTimer: SetMessageTimer
    }
})();
