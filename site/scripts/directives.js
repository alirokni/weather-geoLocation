// global functions

app.directive('external', function() {
    return {
        compile: function(element) {
            var elems = (element.prop("tagName") === 'A') ? element : element.find('a');
            elems.attr({
                target: "_blank",
                "class": "external"
});
        }
    }
});

app.directive('pageTitle', function() {
    return {
        link: function($scope, element, attrs) {
            element.on('click', function(e){
                document.title= "Rokni.net > " + element.text();
                $('header.vcard').attr('class', "vcard "+element.attr("data-nav"))
            });
        }
    }
});
 
app.directive('updateClickEvent', function () {
    return {
        link: function($scope, element, attrs) {
            element.on('click oninput change', function(e){
                $('#tabs-5').addClass('selected-tab');
                var tab = element.attr('class'),
                    range = parseInt($("#range").val()),
                    oVal = '', myTab = '';  
                    if( !element.text()){
                        var oVal = element.val();
                    }else{
                        var myTab = (element.attr('class')).substring( (element.attr('class')).indexOf('tabs-') , 6);
                        var oVal = myTab.substring((myTab.length) - 1) - 1;
                    }
                    window.location.href='#/updates#'+$('div.contenttxt').eq( oVal ).attr('id');
                    $('div.contenttxt').eq( oVal ).addClass('selected-tab');
                    $("#range").val(oVal);
                    $('.input-range li').removeClass('light-color');
                    $('.input-range li').eq( oVal ).addClass('light-color');
            })
        }
    }
});


app.directive('btnAction', function(){
    return {
        link: function ($scope, element, attrs) {
            element.on('click', function(e) {
                    //sessionStorage.clear();
                    //$("#note, .req").removeClass("req-on");
                    $("input[id='subject'], input[id='email'], textarea[id='message']").val("");
                    //$(".submit").attr("disabled", "disabled");
            });
        }    
    }
});

// local functions

deliciousApp.directive('deliciousTags', function () {
    return {
        restrict : 'E',
        templateUrl: 'partials/delicious-tags.html'
    };
});
/*
contactApp.directive('appClick', function(){
  return {
        link: function ($scope, element, attrs) {
            element.on('click', function(e) {
                alert($('form[name="oForm"]'));
            });
        }
    }
});
*/