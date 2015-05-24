(function (global, $) {
  $('.btn-toolbar').
    append('\
      <div class="btn-group" data-toggle="buttons">\
        <label class="btn btn-default btn-sm active">\
          <input type="radio" name="sci_or_com" data-value="sci" autocomplete="off" checked> Scientific\
        </label>\
        <label class="btn btn-default btn-sm">\
          <input type="radio" name="sci_or_com" data-value="com" autocomplete="off"> Common\
        </label>\
      </div>\
    ');

  var
    displayOrder = {
      "fishes": 1,
      "herps": 2,
      "crustaceans": 3,
      "mollusks": 4,
      "birds": 5,
      "plants": 6,
      "mammals": 7,
      "insects": 8
    };

  // impose display order on taxonomic groups.
  for (var i = 0; i < taxonomicGroups.length; i++) {
    taxonomicGroups[i].displayOrder = displayOrder[taxonomicGroups[i].className];
  }
  taxonomicGroups.sort(function(a, b) { return a.displayOrder - b.displayOrder; });
  // create divs for each taxonomic group and append a button to the navbar.
  for (var i = 0; i < taxonomicGroups.length; i++) {
    $('.btn-toolbar').
      append('\
        <div class="btn-group" role="group">\
          <button id="' + taxonomicGroups[i]['className'] + '" type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + '">' + taxonomicGroups[i]['name'] + '</button>\
          <button type="button" class="btn btn-sm btn-' + taxonomicGroups[i]['className'] + ' dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
            <span class="caret"></span>\
          </button>\
        </div>\
      ');
  }

  // load species data into arrays by taxonomic group.
  var dropdownMenu = {};
  Object.keys(species).forEach(function (key) {
    if (!dropdownMenu.hasOwnProperty(species[key]['taxonomic_group'])) {
      dropdownMenu[species[key]['taxonomic_group']] = [];
    }
    dropdownMenu[species[key]['taxonomic_group']].push({
      'id': key,
      'sci': species[key]['scientific_name'],
      'com': species[key]['common_name']
      })
  });

  // sort & uniqify each array alphabetically by name and create a dom element that can
  // swapped in and out of the drop down menus.
  Object.keys(dropdownMenu).forEach(function(key) {

    // classStub simplifies keys so that they match displayOrder.
    var
      classStub = key.
        replace(/(^Insects).*$/, '$1').
        toLowerCase().
        replace(/\s/g, '-'),
      liElements
      ;

    // prepare the dom lists.
    ['sci', 'com'].forEach(function (nomenclature) {
      $('<ul id="' + nomenclature + '-' + classStub + '" class="dropdown-menu" role="menu"></ul>').appendTo('body');
      dropdownMenu[key].sort(function(a, b) {
        return (a[nomenclature] > b[nomenclature]) ? 1 : ((b[nomenclature] > a[nomenclature]) ? -1 : 0);
      });
      liElements = '\
        <li><a href="#">% Vulnerable</a></li>\
        <li><a href="#">% Endemic</a></li>\
      ';
      var suppress = ['', 'NA'];
      for (var i = 0; i < dropdownMenu[key].length; i++) {
        // suppress this species if it is indistinguishable from another species.
        if (i < dropdownMenu[key].length - 1) {
          if (dropdownMenu[key][i][nomenclature] === dropdownMenu[key][i+1][nomenclature]) {
            if (suppress.indexOf(dropdownMenu[key][i][nomenclature]) < 0) {
              suppress.push(dropdownMenu[key][i][nomenclature]);
            }
          }
        }
        // don't include this species if it has no name, or is suppressed.
        if (suppress.indexOf(dropdownMenu[key][i][nomenclature]) < 0) {
          liElements += '\
            <li><a href="#" class="species-id" data-species-id="' + dropdownMenu[key][i].id + '">' + dropdownMenu[key][i][nomenclature] + '</a></li>\
          ';
        }
      }
      $('ul#' + nomenclature + '-' + classStub).append(liElements);
      global['$' + nomenclature + 'Lists'] = $('ul.dropdown-menu[id|="' + nomenclature + '"]');
    });
    // initial state offers scientific names.
    $('button.btn-' + classStub + '.dropdown-toggle').parent().append($('ul#' + 'sci-' + classStub));
  });

})(window, jQuery);
