// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

  function createFeatures(earthquakeData) {

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.mag +"</h3><h3>"+ feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      },
      
      pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .6,
          color: "#000",
          stroke: true,
          weight: .8
      })
    }
    });
  
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: 'pk.eyJ1IjoiaXJhaXNnYXJjaWEiLCJhIjoiY2s1ZWhndHV0MjdqZjNvbzRnNm01ODV5OCJ9.fA3JfeUorIte6qJ-Q6bLwA'
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: 'pk.eyJ1IjoiaXJhaXNnYXJjaWEiLCJhIjoiY2s1ZWhndHV0MjdqZjNvbzRnNm01ODV5OCJ9.fA3JfeUorIte6qJ-Q6bLwA'
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });



    // Create layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,  1, 2, 3, 4, 5],
        labels = [];
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;

    };

    legend.addTo(myMap);

  }


function getColor(d) {
  return d > 5? '#F06B6B' :
        d > 4? '#F0A76B' :
        d > 3  ? '#F3BA4D' :
        d > 2  ? '#F3DB4D' :
        d > 1   ? '#E1F34D' :
                  '#B7F34D';
 }

function getRadius(value){
    return value*25000
  }

