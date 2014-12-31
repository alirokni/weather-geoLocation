'use strict';
angular.module("google-chart-example", ["googlechart"]).controller("MainCtrl", function ($scope) {
    var chart1 = {};
    chart1.type = "ColumnChart";
    chart1.cssStyle = "height:400px; width:600px;";
    chart1.data = {"cols": [
        {id: "month", label: "Month", type: "string", p:{}},
        {id: "speed-id", label: "speed", type: "number", p:{}}
    ], "rows": [
        {c: [
            {v: "04/12/14"},
            {v: 87}
        ]},
        {c: [
            {v: "05/12/14"},
            {v: 89}
        ]},
        {c: [
            {v: "06/12/14"},
            {v: 89}
         ]}
    ]};
    chart1.options = {
        "title": "PageSpeed Insights",
        "isStacked": "true",
        "fill": 1,
        "displayExactValues": true,
        "vAxis": {
            "title": "PageSpeed Score", 
            "gridlines": {
                "count": 10
             }
        },
        "hAxis": {
            "title": "Date"
        }
    };
    chart1.formatters = {};
    $scope.chart = chart1;
});
/*! rokni-net-site, built and created from build/js/script.concat.js 02-12-2014 */
function TestCtrl($scope, $element) {    
    $('input[type="submit"]').prop('disabled', 'disabled');
    
    $('input[type="email"]').on('change blur', function() {
        var a =  $('input[type="email"]').val();
        var b = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            (a.length < 1 || !b.test(a) ? $('input[type="submit"]').prop('disabled', 'disabled') : $('input[type="submit"]').removeProp('disabled'))
    });
    
    $('input[type="submit"]').click(function () {
       
        alert( 'a' )
/*
        $.ajax({
            type: 'POST',
            url: 'contactform.php',
            data: {
                email: $('#email').val(),
                subject: $('#subject').val(),
                message: $('#message').val()
            },
            success: function (a) {
                '-1' == a ? ($('#note').addClass('req-on'), 
                $('#note').text('A Valid Email required'))  : '1' == a ? ($('#note').removeClass('req').addClass('pos'), 
                $('#note').text('A Successfull Deliverey'))  : ($('div #note').addClass('req-on'), 
                $('#note').text('There is an issue!!!'))
            }
        })
*/
    });

};
