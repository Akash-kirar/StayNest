


    mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: [ 78.182831,  26.22983], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
