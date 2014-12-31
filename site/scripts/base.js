/*! rokni-net-site, built and created from build/js/script.concat.js 02-12-2014 */
function TestCtrl($scope, $element) {    
    $('input[type="submit"]').prop('disabled', 'disabled');
    
    $('input[type="email"]').on('change blur', function() {
        var a =  $('input[type="email"]').val();
        var b = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            (a.length < 1 || !b.test(a) ? $('input[type="submit"]').prop('disabled', 'disabled') : $('input[type="submit"]').removeProp('disabled'))
    });
    
    $('input[type="submit"]').click(function () {
       
        alert( $element.a )
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
