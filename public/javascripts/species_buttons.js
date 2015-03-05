(function (global, $) {
  for (var i = 0; i < global.taxonomicGroups.length; i++) {
    $('.btn-toolbar').
      append(' \
        <div class="btn-group"> \
          <button id="' + taxonomicGroups[i]['className'] + '" type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + '">' + taxonomicGroups[i]['name'] + '</button> \
          <button type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + ' dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> \
            <span class="caret"></span> \
            <span class="sr-only">Toggle Dropdown</span> \
          </button> \
          <ul class="dropdown-menu" role="menu"> \
            <li ui-sref-active="active"> \
              <a href ui-sref="about"> \
                 % Vulnerable \
              </a> \
            </li> \
            <li ui-sref-active="active"> \
              <a href ui-sref="about"> \
                % Endemic \
              </a> \
            </li> \
          </ul> \
         </div> \
      ');
    }
})(window, jQuery);
