(function (global, $) {
  // get the taxonomic groups and counts
  var
    taxonomicGroups = [],
    url = 'http://api-freshwaterspecies.statewater.org/taxonomic_groups/';
  if (!localStorage.getItem('taxonomicGroups')) {
    $.getJSON(url).success(function(data) {
      var tg = data.taxonomic_groups;
      for (var i = 0; i < tg.length; i++ ) {
        if (tg[i][i]['name'].match('^Insects')) {
          tg[i][i]['name'] = 'Insects';
        }
        tg[i][i]['className'] = tg[i][i]['name'].toLowerCase().replace(/\s/g, '-');
        taxonomicGroups.push(tg[i][i]);
      }
      localStorage.setItem('taxonomicGroups', JSON.stringify(taxonomicGroups));
      global.taxonomicGroups = taxonomicGroups;
    })
  } else {
    global.taxonomicGroups = JSON.parse(localStorage.getItem('taxonomicGroups'));
  }
  // get the species
  var
    species = [];
    url = 'http://api-freshwaterspecies.statewater.org/species/';
  if (!localStorage.getItem('species')) {
    $.getJSON(url).success(function(data) {
      var holder = {}, speciesId;
      for (var i = 0; i < data.species.length; i++ ) {
        speciesId = Object.keys(data.species[i]);
        holder[speciesId] = data.species[i][speciesId];
      }
      species = holder;
      localStorage.setItem('species', JSON.stringify(species));
      global.species = species;
    })
  } else {
    global.species = JSON.parse(localStorage.getItem('species'));
  }
})(window, jQuery);
