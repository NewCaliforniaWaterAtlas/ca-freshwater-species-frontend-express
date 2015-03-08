(function (global, $) {
  var spin_opts = {
    radius: 48,   // inner radius
    length: 32,   // extension beyond radius
    width: 16,
    shadow: true
  };

  $('#map').append('\
    <div id="ajax-spinner"></div> \
  ');

  $(global).ajaxStart(function() {
    $('#ajax-spinner').spin(spin_opts);
  });

  $(global).ajaxComplete(function() {
    $('#ajax-spinner').spin(false);
  });

})(document, jQuery);
