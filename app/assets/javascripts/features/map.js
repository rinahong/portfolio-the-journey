// import qs, qsa from './helpers'
let poly;
let map;
let geocoder;
let infowindow;
let path;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 49.879, lng: 13.624}  // Center the map on Chicago, USA.
  });

  infowindow = new google.maps.InfoWindow;
  //For Geocode input box and submit event handler
  geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  //For drawing polylines
  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
  poly.setMap(map);

  const clickable = $('#map').data('clickable');
  // Add a listener for the click event for polylines on trip controller edit page
  if(clickable) {
    map.addListener('click', addLatLng);
  }
}

//For Polylines!!!!!!!
// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
  path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);
  // displayLocation(path.b[path.b.length - 1]);
  geocodeLatLng(geocoder, map, infowindow, path.b[path.b.length - 1]);

  // Add a new marker at the new plotted point on the polyline.
  let marker = new google.maps.Marker({
     position: event.latLng,
     title: '#' + path.getLength(),
     map: map
  });
}

function deleteLatLng(event) {

}


//For searching by address!!!!!!!
function geocodeAddress(geocoder, resultsMap) {
  let address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

//For getting address using latitude and longitude
function geocodeLatLng(geocoder, map, infowindow, path) {
  let latlng = {lat: path.lat(), lng: path.lng()};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        let city = "";
        let state = "";
        let country = "";
        let addressArr = [];
        for (let ac = 0; ac < results[0].address_components.length; ac++) {
            let component = results[0].address_components[ac];

            switch(component.types[0]) {
              case 'locality':
                city = component.long_name;
                if(city !== "") {
                  addressArr.push(city);
                }
                break;
              case 'administrative_area_level_1':
                state = component.short_name;
                if(state !== "") {
                  addressArr.push(state);
                }
                break;
              case 'country':
                country = component.long_name;
                if(country !== "") {
                  addressArr.push(country);
                }
                break;
            }
        }
        address = addressArr.join(', ');
        console.log(address);
        map.setZoom(11);
        let marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        console.log(`path.b, lat:`, path.lat());
        console.log(`path.b, lng:`, path.lng());
        let contentString = '<div id="content">'+
           '<div id="routeInfo">' +
           '<span class="address">' + address + '</span>' +
           '<i class="fa fa-plus-circle fa-2x" aria-hidden="true"></i>' +
           '</div>';
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
       }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


function displayLocation(path) {
    console.log(`path.b, lat:`, path.lat());
    console.log(`path.b, lng:`, path.lng());
    //qs('.latlng')
}