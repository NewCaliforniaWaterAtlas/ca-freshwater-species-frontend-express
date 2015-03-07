(function (global, $) {
  var
    dropdownMenu = {},
    url_species = 'http://api-freshwaterspecies.statewater.org/species/';
  // create divs for each taxonomic group and append a button to the navbar.
  for (var i = 0; i < taxonomicGroups.length; i++) {
    $('.btn-toolbar').
      append(' \
        <div class="btn-group" role="group"> \
          <button id="' + taxonomicGroups[i]['className'] + '" type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + '">' + taxonomicGroups[i]['name'] + '</button> \
          <button type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + ' dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> \
            <span class="caret"></span> \
          </button> \
          <ul id="' + taxonomicGroups[i]['className'] + '" class="dropdown-menu" role="menu"> \
            <li> \
              <a href="#"> \
                 % Vulnerable \
              </a> \
            </li> \
            <li> \
              <a href="#"> \
                % Endemic \
              </a> \
            </li> \
          </ul> \
         </div> \
      ');
    dropdownMenu[taxonomicGroups[i].className] = [];
    }
  // load species data into arrays by taxonomic group.
  Object.keys(species).forEach(function (key, index) {
    dropdownMenu[species[key]['taxonomic_group'].
      replace(/(^Insects).*$/, '$1').
      toLowerCase().
      replace(/\s/g, '-')
      ].push({
        'name': species[key]['scientific_name'],
        'id': key
      });
  });
  // sort each array alphabetically by scientific name.
  Object.keys(dropdownMenu).forEach(function (key, index) {
    dropdownMenu[key].sort(function(a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
    var liElements = '';
    for (var i = 0; i < dropdownMenu[key].length; i++) {
      liElements += ' \
        <li> \
          <a href="' + url_species + dropdownMenu[key][i].id + '">' + dropdownMenu[key][i].name + '</a> \
        </li> \
      ';
    }
    $('ul#' + key).append(liElements);
  });
})(window, jQuery);
