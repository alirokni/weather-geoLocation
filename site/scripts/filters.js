// global filters
app.filter('addSpace', function() {
    return function(scope) {
        var value = scope.trim() || '',
            out = value.concat('');
        return out;
    };
});