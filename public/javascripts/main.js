function initMap() {
  var l;
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

  // Colorbrewer2: ten data classes, qualitative, applied to hr_name
  var cb_hr_name = [
    'rgb(141,211,199)',
    'rgb(255,255,179)',
    'rgb(190,186,218)',
    'rgb(251,128,114)',
    'rgb(128,177,211)',
    'rgb(253,180,98)',
    'rgb(179,222,105)',
    'rgb(252,205,229)',
    'rgb(217,217,217)',
    'rgb(188,128,189)'
  ];

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
    console.log('make ajax request.');
//    var url = 'http://ca-features.statewater.org/hucs?f=topojson&bbox=' + current.bbox.tuple;
    var url;
    url = 'http://api-freshwaterspecies.statewater.org/huc12sz' + current.zoom + '/?in_bbox=' + current.bbox.tuple;
    console.log(url);
    $.getJSON(url).done(addTopoData);

    function addTopoData(topoData){
      console.log('ajax request processing complete.');
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

    function handleLayer(layer){
      layer.setStyle(style(layer));

      layer.on('mouseover mousemove', function(e) {
        layer.setStyle({ fillOpacity: 0.9 });
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
      var fillColor;
      switch (e.feature.properties.hr_name) {
        case 'Central Coast':     fillColor = cb_hr_name[0]; break;
        case 'Colorado River':    fillColor = cb_hr_name[1]; break;
        case 'North Coast':       fillColor = cb_hr_name[2]; break;
        case 'North Lahontan':    fillColor = cb_hr_name[3]; break;
        case 'Sacramento River':  fillColor = cb_hr_name[4]; break;
        case 'San Francisco Bay': fillColor = cb_hr_name[5]; break;
        case 'San Joaquin River': fillColor = cb_hr_name[6]; break;
        case 'South Coast':       fillColor = cb_hr_name[7]; break;
        case 'South Lahontan':    fillColor = cb_hr_name[8]; break;
        case 'Tulare Lake':       fillColor = cb_hr_name[9]; break;
      }
      return { stroke: true, color: '#111', weight: 1, opacity:0.7, fill: true, fillColor: fillColor, fillOpacity: 0.5 };
    }

  }

}
