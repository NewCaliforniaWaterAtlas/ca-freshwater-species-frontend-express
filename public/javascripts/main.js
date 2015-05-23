function initMap() {
  var
    l,
    apiHost = 'localhost:5010';
  var map = L.map('map', {
    zoom: 6,
    minZoom: 6,
    maxZoom: 15,
    maxBounds: ([[29.5, -127.4], [45.0, -111.1]])
  });

  // on('load') fires when the map's center and zoom are set for the first time, so this precedes setView().
  map.on('load dragend zoomend', function (e) {
    var current = {};
    current.zoom = map.getZoom();
    current.bbox = {
      'tuple': map.getBounds().getSouthWest().lng.toFixed(2) + ',' +
      map.getBounds().getSouthWest().lat.toFixed(2) + ',' +
      map.getBounds().getNorthEast().lng.toFixed(2) + ',' +
      map.getBounds().getNorthEast().lat.toFixed(2)
    };
    console.log(current);
    getGeoJson(current);
  });

  map.setView([37.8922, -119.3335], 6);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //  L.tileLayer('https://a.tiles.mapbox.com/v4/erictheise.k93ep0p9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXJpY3RoZWlzZSIsImEiOiJqanBuc3NvIn0.3n-yBu6rKZtkb19T5Bh8GQ', {
    attribution: 'Map layer &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale({ position: 'bottomleft' }).addTo(map);

  function getGeoJson(current) {
    console.log('make ajax huc request.');
    var url_hucs;
    url_hucs = 'http://' + apiHost + '/huc12sz' + current.zoom + '/?in_bbox=' + current.bbox.tuple;
    $.getJSON(url_hucs).done(addTopoData);

    function addTopoData(topoData) {
      console.log('ajax huc request processing complete.');
      console.log(topoData);
      if (typeof l !== 'undefined') {
        map.removeLayer(l);
        l = null;
      }
      l = new L.TopoJSON();
      l.addData(topoData);
      l.addTo(map);
      l.eachLayer(handleLayer);
    }

  }

  function handleLayer(layer) {
    layer.setStyle(style(layer));

    layer.on('mouseover mousemove', function(e) {
      layer.setStyle({fillOpacity: 0.9});
    });

    layer.on('mouseout', function(e) {
      layer.setStyle(style(layer));
      map.closePopup();
    });

    layer.bindPopup(
      '<b>' + layer.feature.properties.first_hu_1 + '</b><br/>' +
      '(' + layer.feature.properties.hr_name + ')'
    );
  }

  function style (e) {
    return {
      stroke: true, color: '#111', weight: 1, opacity: 0.7,
      fill: true, fillColor: '#fff', fillOpacity: 0.4 };
  }

  $('.species-id').on('click', function () {
    getHuc12sBySpecies($(this).data('speciesId'), $(this).parents('ul').attr('id'));
  });

  function getHuc12sBySpecies(speciesId, className) {
    console.log('make ajax species request.');
    var url_huc12s_by_species = 'http://' + apiHost + '/huc12sbyspecies/' + speciesId + '/';
    $.getJSON(url_huc12s_by_species).done(renderHuc12s);

    function renderHuc12s(speciesData) {
      console.log('ajax huc request processing complete.');
      console.log(speciesData.length);
      updateSummary(speciesId, speciesData.length);
      l.eachLayer(function(layer) {
        layer.setStyle(style(layer));
        if ($.inArray(layer.feature.id, speciesData) > -1) {
          layer.setStyle({fillColor: $('.btn-' + className).css('background-color')});
        }
      });
    }

  }

  function updateSummary(speciesId, count) {
    $('#summary').show();
    var
      speciesSlug = '',
      panelBody = '';
    if (typeof species[speciesId].common_name === 'undefined' || !species[speciesId].common_name ) {
      speciesSlug = '<a target="_new" href="http://en.wikipedia.org/wiki/' + species[speciesId].scientific_name + '">' + species[speciesId].scientific_name + '</a>';
    } else {
      speciesSlug = 'The ' + species[speciesId].common_name + ' (<a target="_new" href="http://en.wikipedia.org/wiki/' + species[speciesId].scientific_name + '">' + species[speciesId].scientific_name + '</a>)';
    }

    if (species[speciesId].alt_scientific_names) {
      var
        s = species[speciesId].alt_scientific_names,
        alternatives = ''
        ;
      switch (s.split(',').length) {
        case 1:
          speciesSlug += ', also known by the name ' + s + ', ';
          break;
        case 2:
          alternatives = s.substring(0, s.lastIndexOf(',')) + ' and' + s.substring(s.lastIndexOf(',') + 1);
          speciesSlug += ', also known by the names ' + alternatives + ', ';
          break;
        default:
          alternatives = s.substring(0, s.lastIndexOf(',')) + ', and' + s.substring(s.lastIndexOf(',') + 1);
          speciesSlug += ', also known by the names ' + alternatives + ', ';
          break;
      }
    }

    if (count > 0) {
      panelBody = ' \
      ' + speciesSlug + ' \
      has been found in ' + count + ' watersheds in California. \
      '
    } else {
      panelBody  = ' \
      ' + speciesSlug + ' \
      is a freshwater species in California, but researchers have not yet provided observation information in the sources we reviewed.  If you know where this species is found, add the locations to <a href="http://www.inaturalist.org/">iNaturalist.org</a> or another public data repository so it can be included in conservation planning efforts. \
      '
    }

    $('.panel-body').
      empty().
      append(panelBody);
  }

  // swap between dropdowns of scientific names and common names.
  $('input[name=sci_or_com]').on('change', function () {
    if ($(this).data('value') === 'com') {
      $('ul.dropdown-menu[id|="sci"]').detach();
      $.each($comLists, function (index, $ul) {
        $('button.btn-' + $(this).attr('id').replace('com-','') + '.dropdown-toggle').parent().append($(this));
      })
    } else if ($(this).data('value') === 'sci') {
      $('ul.dropdown-menu[id|="com"]').detach();
      $.each($sciLists, function (index, $ul) {
        $('button.btn-' + $(this).attr('id').replace('sci-','') + '.dropdown-toggle').parent().append($(this));
      })
    }
  })

}
