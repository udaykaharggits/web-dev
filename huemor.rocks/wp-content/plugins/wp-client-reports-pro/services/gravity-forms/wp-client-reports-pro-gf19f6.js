(function( $ ) {
    "use strict";

    $(document).on('gform_post_render', function(event, form_id, current_page){
        var dataString = 'action=wp_client_reports_pro_form_view&plugin=gravity_forms&form_id=' + form_id;
        $.ajax({
            type: "POST",
            url: wp_client_reports_pro.ajax_url,
            data: dataString,
            dataType: 'json',
            success: function(data, err) {
                
            }
        });
    });

}(jQuery));
