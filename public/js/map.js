  mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
        container: 'map', 
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: listing.geometry.coordinates, 
        zoom: 12 
    });





     const marker = new mapboxgl.Marker({color:"red"})
    
    .setLngLat(listing.geometry.coordinates)

    .setPopup ( new mapboxgl.Popup({offset:25})
   
    .setHTML(`<h3>shop name<h4>${listing.title}</h4><p>exact location of your shop</p>`))
    .addTo(map);


    
   