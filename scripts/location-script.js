// main function
$(function () {
    $('#js-geo-btn').on('click', findMyLocationWeather);
});

function findMyLocationWeather() {
    // check if browser supports geo location and get coordination, else call search by ciry name function
    if (!navigator.geolocation) {
        alert('Your browser is not supporting html5 geo location.\nA search will provide the your location.');
        searchLocationEnter();
    } else {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
    }

    // on success, get and display the corrodincations and call openWeatherApi using latitude and longitude
    function geoSuccess(position) {
        $('#js-lat').text(position.coords.latitude);
        $('#js-lon').text(position.coords.longitude);
        $('#js-acc').text(position.coords.accuracy);
        passLocationCoordination(position.coords.latitude, position.coords.longitude);
        $('#js-container-geo, #js-container-report').removeClass('hidden');
    }
    // on failure of permission denied, show an error message. On other errors call search function
    function geoFail(error) {
        $('#js-container-main').removeClass('hidden');
        var errorMessage = "",
            geoError = {
                1: "PERMISSION DENIED",
                2: "POSITION UNAVAILABLE",
                3: "TIMEOUT"
            };
        if (error.code === 1) {
            errorMessage = error.message + ". Please \'Allow\' use of your computer location on browser\'s address bar and reload this page.";
            $('#js-container-main').text(errorMessage).addClass('container-error bg-danger');
        } else {
            $('#js-container-search').removeClass('hidden');
            searchLocationEnter();
        }
    }
}

// construction of openWeatherApi url with geo location coordination
function passLocationCoordination(l1, l2) {
    var la = l1;
    var lo = l2;
    var openWeatherApi = "http://api.openweathermap.org/data/2.5/weather?APPID=4d3aaef3c8ef1cc9ffe7bf1c91665949&lat=" + la + "&lon=" + lo;
    passSearchLocation(openWeatherApi);
    $('#js-container-ego').removeClass('hidden');
}

// construction of openWeatherApi url with search query
function searchLocationEnter() {
    $('#js-geo-search').on('click', function () {
        var $serachVal = $('#js-citySerach').val()
        var openWeatherApi = "http://api.openweathermap.org/data/2.5/weather?APPID=4d3aaef3c8ef1cc9ffe7bf1c91665949&q=" + $serachVal;
        //  validation for empty serach value
        if(!!$serachVal.length) {
            passSearchLocation(openWeatherApi);
            $('#js-container-search').removeClass('hidden');
        }
    });
}

// on success get openWeatherApi json data and display the result else show the error message
function passSearchLocation(openWeatherApi) {
    $.getJSON(openWeatherApi)
        .done(function (weather) {
            if(weather.cod != "404") {
                $('#js-container-error').text('').removeClass('container-error bg-danger');
                $('#js-city').text(weather.name);
                $('#js-country').text(weather.sys.country);
                $('#js-weather-description').text(weather.weather[0].description);
                $('#js-weather-main').text(weather.weather[0].main);
                $('#js-weather-temp').text((((weather.main.temp - 273.15) * 9 / 5) + 32).toFixed(2));
                $('#js-img-icon').prop('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
                $('#js-container-report').removeClass('hidden');
            }else{
                $('#js-container-report').addClass('hidden');
                $('#js-container-error').text(weather.message).addClass('container-error bg-danger');
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
}
