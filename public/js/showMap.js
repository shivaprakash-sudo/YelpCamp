mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', //container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    projection: "globe" //display map as 3D globe
});

// add zoom controls to the map
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup()
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);