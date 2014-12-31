'use strict';

angular.module('google-chart-example', ['googlechart']).controller("MainCtrl", function ($scope) {

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


