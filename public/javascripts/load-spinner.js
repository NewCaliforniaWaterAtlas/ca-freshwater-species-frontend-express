(function (global, $) {
  $('#map').append('\
    <div id="ajax-spinner"></div> \
  ');

  $(global).ajaxStart(function() {
    $('#ajax-spinner').spin();
  });

  $(global).ajaxComplete(function() {
    $('#ajax-spinner').spin(false);
  });

})(document, jQuery);
