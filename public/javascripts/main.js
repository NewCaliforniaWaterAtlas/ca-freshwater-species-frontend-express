function initMap() {
  var
    l,
    apiHost = 'localhost:5010';
  var map = L.map('map', {
    minZoom: 6,
    maxZoom: 15,
    maxBounds: ([[29.5, -127.4], [45.0, -111.1]])
  }).
    setView([37.8922, -119.3335], 6);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //  L.tileLayer('https://a.tiles.mapbox.com/v4/erictheise.k93ep0p9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXJpY3RoZWlzZSIsImEiOiJqanBuc3NvIn0.3n-yBu6rKZtkb19T5Bh8GQ', {
    attribution: 'Map layer &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale({ position: 'bottomleft' }).addTo(map);

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

  function getGeoJson(current) {
    console.log('make ajax huc request.');
    var url_hucs;
    url_hucs = 'http://' + apiHost + '/huc12sz' + current.zoom + '/?in_bbox=' + current.bbox.tuple;
    $.getJSON(url_hucs).done(addTopoData);

    function addTopoData(topoData) {
      console.log('ajax huc request processing complete.');
      console.log(topoData);
      if (l !== undefined) {
        map.removeLayer(l);
        l = null;
      }
      l = new L.TopoJSON();
      l.addData(topoData);
      l.addTo(map);
      l.eachLayer(handleLayer);
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
  }

  function style (e) {
    return {
      stroke: true, color: '#111', weight: 1, opacity:0.7,
      fill: true, fillColor: '#fff', fillOpacity: 0.4 };
  }

  $('.species-id').on('click', function () {
    getHuc12sBySpecies($(this).data('speciesId'), $(this).parents('ul').attr('id'));
  });

  function getHuc12sBySpecies(species_id, className) {
    console.log('make ajax species request.');
    var url_huc12s_by_species = 'http://' + apiHost + '/huc12sbyspecies/' + species_id;
    $.getJSON(url_huc12s_by_species).done(renderHuc12s);

    function renderHuc12s(speciesData) {
      console.log('ajax huc request processing complete.');
      console.log(speciesData.length);
      l.eachLayer(function(layer) {
        layer.setStyle(style(layer));
        if ($.inArray(layer.feature.id, speciesData) > -1) {
          layer.setStyle({fillColor: $('.btn-' + className).css('background-color')});
        }
      });
    }

  }

}
