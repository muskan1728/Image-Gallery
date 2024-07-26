mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  pitch: 60

});
map.addControl(new mapboxgl.NavigationControl());

    map.once('style.load', () => {
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.setConfigProperty('basemap', 'showPlaceLabels', false);
        map.setConfigProperty('basemap', 'showRoadLabels', false);
        map.setConfigProperty('basemap', 'showTransitLabels', false);
    });

  // Create a default Marker and add it to the map.
  const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  
  .addTo(map);
  const popup = new mapboxgl.Popup({offset:25})
  .setLngLat(campground.geometry.coordinates)
  .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
  .addTo(map);
  // new mapboxgl.Popup({offset:25})
  //     .setHTML(`<h3>${campground.title}</h3>`)
