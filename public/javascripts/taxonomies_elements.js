(function (global, $) {
  // get the taxonomic groups and counts
  var
    taxonomicGroups = [],
    url = 'http://api-freshwaterspecies.statewater.org/taxonomic_groups/';
  if (!localStorage.getItem('taxonomicGroups')) {
    $.getJSON(url).success(function(data) {
      for (var i = 0; i < data.taxonomic_groups.length; i++ ) {
        if (data.taxonomic_groups[i][i]['name'].match('^Insects')) {
          data.taxonomic_groups[i][i]['name'] = 'Insects';
        }
        taxonomicGroups.push(data.taxonomic_groups[i][i]);
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
