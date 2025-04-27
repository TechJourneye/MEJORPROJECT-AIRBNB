
mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 9 // starting zoom
  });

  const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(Listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25,})
  .setHTML(`${Listing.location}<h1> Exact location will be provided after booking</h1>`))
  .addTo(map);