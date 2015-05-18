(function (global, $) {
  // get the taxonomic groups and their frequencies
  var
    taxonomicGroups = [],
    url = 'http://api-freshwaterspecies.statewater.org/taxonomic_groups/';
    // url = 'http://localhost:5010/taxonomic_groups/';
  if (!localStorage.getItem('taxonomicGroups')) {
    $.getJSON(url).success(function(data) {
      var tg = data.taxonomic_groups;
      for (var i = 0; i < tg.length; i++ ) {
        if (tg[i]['name'].match('^Insects')) {
          tg[i]['name'] = 'Insects';
        }
        tg[i]['className'] = tg[i]['name'].toLowerCase().replace(/\s/g, '-');
        taxonomicGroups.push(tg[i]);
      }
      localStorage.setItem('taxonomicGroups', JSON.stringify(taxonomicGroups));
      global.taxonomicGroups = taxonomicGroups;
    })
  } else {
    global.taxonomicGroups = JSON.parse(localStorage.getItem('taxonomicGroups'));
  }
  // get the species
  var
    species = [],
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
