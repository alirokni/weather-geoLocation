// Immediately-Invoked Function Expression (IIFE) of weather report
(function intialCityWeatherReport(){
    var intialCity = 'Paris';
    searchGetLocation( intialCity );
})();

// main functions
$(function () {
    $('#js-geo-btn').on('click', findMyLocationWeather);
    $('#js-geo-search').on('click', searchLocationEnter);
    setTimeout(function(){$('.information .js-geolocation-note').removeClass('bg-warning');},3000);
});

// html5 geo location function to access geographical location information of hosting device 
function findMyLocationWeather() {
    var $latitude, $longitude;
    // check if browser supports geo location and get coordination, else call search by city name function
    if (!navigator.geolocation) {
        $('#js-container-message').text('Your browser is not supporting html5 geo location.\nA Please use Search for your location.').addClass('container-message bg-danger');
    }else{
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
        $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
        $('.information .js-geolocation-note').addClass('bg-warning');
        setTimeout(function(){$('.information .js-geolocation-note').removeClass('bg-warning');},3000);
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
            setTimeout(function(){$('.information .js-geolocation-note').removeClass('bg-warning');},3000);
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
function accessLocation(cityName, $latitude, $longitude){
    var weatherParam;
    if(cityName){
        weatherParam = 'q=' + cityName;
    }else{
        weatherParam = '&lat=' + $latitude + '&lon=' + $longitude;
    }    
    $('#js-container-report').addClass('bg-success');
    return weatherParam;
}

// helper function for temperature conversion of Kelvin to Farhrenheit
function KelvinToFahrenheit(temperature ){
    var temp = Math.round(((temperature - 273.15) * 9 / 5) + 32);
    return temp;
}

// call openWeatherApi json data on success and display the result else show the error message
function searchGetLocation(cityName, $latitude, $longitude) {
    $('#js-location-serach').val('');
    $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://api.openweathermap.org/data/2.5/weather?APPID=1111111111',
        data: accessLocation(cityName, $latitude, $longitude),
        success: function (weather) {
            if (weather.cod !== '404') {
                $('#js-container-message').text('').removeClass('container-message bg-danger');
                $('#js-city').text(weather.name);
                $('#js-country').text(weather.sys.country);
                $('#js-weather-description').text(weather.weather[0].description);
                $('#js-weather-main').text(weather.weather[0].main);
                $('#js-weather-temp').text( KelvinToFahrenheit(weather.main.temp) );
                $('#js-img-icon').prop('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
                $('#js-container-report').removeClass('hidden');
            } else {
                $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
                setTimeout(function(){$('#js-container-report').removeClass('bg-success');},3000);
            }
        },
        error: function (textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        }
    });
}
