mapboxgl.accessToken = 'pk.eyJ1IjoidXJiaWNhIiwiYSI6ImNpamFhZXNkOTAwMnp2bGtxOTFvMTNnNjYifQ.jUuvgnxQCuUBUpJ_k7xtkQ';
var map = new mapboxgl.Map({
    container: 'map',
    zoom: 16,
    center: [37.557184,55.694286],
    style: 'mapbox://styles/mapbox/satellite-v9'
});

var text = document.getElementById('text'),
    lineLength = 0,
    lineJson = { type: "FeatureCollection", features: [] };

handleScroll = () => {
  var position = text.scrollTop/text.scrollHeight;
  var positionPoint = turf.along(lineJson.features[0],lineLength*position);
  var positionPointNext = turf.along(lineJson.features[0],lineLength*position+1);
  var bearing = turf.bearing(positionPointNext,positionPoint);
  console.log(lineLength,position,positionPoint);
  map.setCenter(positionPoint.geometry.coordinates);
  map.setBearing(bearing);
  map.getSource("point").setData({type:"FeatureCollection", features:[positionPoint]});

}


text.onscroll = handleScroll;

map.on('click', ()=>{
  console.log(map.getCenter());
  console.log(map.getBearing());
  console.log(map.getPitch());
});

map.on('load', ()=>{
  d3.json('./data/line.geojson', (json)=>{
    map.addSource("line", {type: "geojson", data: json});
    map.addSource("point", {type: "geojson", data: {type: "FeatureCollection", features: [] }});
    lineLength = turf.length(json);
    lineJson = json;
    console.log(lineLength);
    map.addLayer({
      id: "line",
      source: "line",
      type: "line",
      paint: {  "line-color": "#fff", "line-width": 0 }
    });
    map.addLayer({
      id: "point-bg",
      source: "point",
      type: "circle",
      paint: {  "circle-color": "#1DE9FF", "circle-radius": 24, "circle-opacity": 0.3 }
    });
    map.addLayer({
      id: "point",
      source: "point",
      type: "circle",
      paint: {  "circle-color": "#fff", "circle-radius": 6, "circle-opacity": 0.8 }
    });

    //start
    handleScroll();
  });
});
