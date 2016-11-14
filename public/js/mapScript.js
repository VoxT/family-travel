
var key = 'AIzaSyCvf3SMKYOCFlAtjUTKotmrF6EFrEk2a40';

var olat = request.olat, olng = request.olng, dlat = request.dlat, dlng = request.dlng;

// begin result search map
var map, placeService, infoWindow;
var markers = [];
var iconType = {
          'restaurant':
                {
                  icon : "images/icons/restaurant.png"
                },
         
          'museum':
               { 
                icon : "images/icons/museum.png"
             },
          'park':
               {
                icon  : "images/icons/park.png"
              },
          'zoo':
               {
                icon  : "images/icons/zoo.png"
              },        
          'amusement_park':
                {
                  icon : "images/icons/amuseum_park.png"
                },
          'church':
          {
            icon : "images/icons/church.png"
          },

          
          'art_gallery':
               {
                icon  : "images/icons/art.png"
              }
        
         };

function initMap() {
  var origin_place_id = null;
  var destination_place_id = null;
  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');

  origin_input.value = (request.originplace);
  destination_input.value = (request.destinationplace);

  origin_place_id = request.oPlaceId;
  destination_place_id = request.dPlaceId;

    var travel_mode = 'DRIVING';
    var mapOptions = {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.SATELLITE
          ]
      },
      styles: [
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},{featureType:"water",stylers:[{visibility:"simplified"},{color:"#3fb3de"}]},{featureType:"transit.line",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"}]},{featureType:"transit.line",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"transit.line",elementType:"geometry",stylers:[{color:"#ffffff"}]},{featureType:"transit.line",elementType:"geometry.fill",stylers:[{color:"#cccccc"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#bbbbbb"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#ffffff"}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.local",elementType:"geometry.stroke",stylers:[{color:"#d1d1d1"}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#d1d1d1"}]},{featureType:"road",elementType:"labels.icon",stylers:[{lightness:50}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#393c3d"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{lightness:30}]},{featureType:"landscape",stylers:[{lightness:30},{saturation:-50}]}]
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    placeService = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
          });

  	var options = {
  	types: ['(cities)']
  	};

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input, options);
    origin_autocomplete.bindTo('bounds', map);
    var destination_autocomplete =
        new google.maps.places.Autocomplete(destination_input, options);
    destination_autocomplete.bindTo('bounds', map);

    origin_autocomplete.addListener('place_changed', function() {
      var place = origin_autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      olat = place.geometry.location.lat();
      olng = place.geometry.location.lng();

      // If the place has a geometry, store its place ID and route if we have
      // the other place ID
      origin_place_id = place.place_id;
      route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
      var place = destination_autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      dlat = place.geometry.location.lat();
      dlng = place.geometry.location.lng();
      // If the place has a geometry, store its place ID and route if we have
      // the other place ID
      destination_place_id = place.place_id;
      route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    });

    route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
   
 
    // handler result item
    // $('#things').click( function() {
    //  showInterestingThings(destination_place_id);
    // });

    //  $('#things').click( function() {
    //   ShowRestaurant(destination_place_id);
    // });

     $(document).on('click', '#restaurant', function() {
     ShowRestaurant(destination_place_id);
    });  
     
     $(document).on('click', '#museum', function() {
     ShowMuseum(destination_place_id);
    }); 
     

}

function expandViewportToFitPlace(place) {
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }
}

function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
  if (!origin_place_id || !destination_place_id) {
    return;
  }
  directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}


function showInterestingThings(place_id) {
  placeService.getDetails({
        placeId: place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          map.panTo(place.geometry.location);
          map.setZoom(13);
          map.addListener('idle', search);
        }
      });
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


// search interesting things
function search() {
 
  var searchParams = {
    bounds: map.getBounds(),
    types: ['museum','park','zoo','amusement_park','church'],//, 'night_club', 'campground', 'church'
    //keyword:   "(zoo) OR (park) OR (establishment)  "
    //keyword : 'Attractions',
    keyword:   " (attractions) OR (point_of_interest)OR (establishment)  "

  };
  placeService.radarSearch(searchParams, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
  
    for (var i = 0, results; result = results[i]; i++) {
       //PlaceReviews(result);
       addMarker(result);
       //console.log(PlaceReviews(result));
     placeService.getDetails({placeId: result.place_id},
      function(place, status) {
         $("#show").append(PlaceReviews(place));
       });
    }

  }
}

function addMarker(place) {

  placeService.getDetails({placeId: place.place_id},
    function(result, status) {
       
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      var icon = intersectionJson(iconType, result.types);
      if(!(icon.length > 0)) {
        icon.push('art_gallery');
      }
      var marker = new google.maps.Marker({
            map: map,
            position: result.geometry.location,
            //animation: google.maps.Animation.DROP,
            icon : iconType[icon[0]].icon
          });
      markers.push(marker);
      //mousover 
      google.maps.event.addListener(marker, 'mouseover', function() {
          infoWindow.open(map, marker);
          buildIWContent(result);
      }); 
      google.maps.event.addListener(marker, 'mouseout', function() {
          infoWindow.close();
      }); 
      google.maps.event.addListener(marker, 'click', function() {
           PlaceReviews(result);
      });    

    }); 
}

function intersectionJson(a, b)
{
  var result = [];
  for(var x in a) {
    for(y in b) {
      if( x == b[y])
        result.push(b[y]);
    }
  }
  return result;
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
      console.log('here');
    }
  }
  markers = [];
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
} 

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function showInfoWindow(result) {
  marker = this;
  //infoWindow.setContent(buildIWContent(place);
  console.log(JSON.stringify(result));
  infoWindow.open(map, marker);
  buildIWContent(result);
}
          
  // Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  if(place.photos) {
  document.getElementById('iw-icon').innerHTML = '<img class=" image_place"' +
      'src="' + place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) + '"/>';
    }
    else {
  document.getElementById('iw-icon').innerHTML = '<img class=" image_place"'+
      'src="images/iw-icon/icon.png " />';
    }

  document.getElementById('iw-url').innerHTML = '<b><a   href="' + place.url +
      '">' + place.name + '</a></b>';
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
            ratingHtml += '<span style="font-size:120%;color:#E7E5E5;" >&#9734;</span>'
          } else {
            ratingHtml += '<span style="font-size: 120%;color:#F9C81F;">&#9733;</span>'
          }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
      var ratingHtml = '';
      ratingHtml = '<span style="font-size:120%;color:#E7E5E5;" >&#9734; &#9734; &#9734; &#9734; &#9734;</span>'
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
         
      }  

}


//REVIEW PLACE 

function PlaceReviews(place) {

   var ResImageHtml='';

  if (place.photos != null) {
     for (var i = 0; i<place.photos.length ; i++){
   
      ResImageHtml +=  '<img class="ResImage"' +
            'src="' + place.photos[i].getUrl({'maxWidth': 500, 'maxHeight': 500}) + '"/>' 
 //    document.getElementById('res-image').innerHTML= ResImageHtml;
          }
         // console.log(ResImageHtml);
  }
   var  urlHtml = '<b><a   href="' + place.url +'">' + place.name + '</a></b>';
 //   document.getElementById('res-url').innerHTML = urlHtml;
    
  //  document.getElementById('res-address').textContent = place.vicinity;
      
    var reviewsHtml = '';
    if(place.reviews){
        for (var j = 0; j < place.reviews.length; j++) {
          reviewsHtml += '<p class="review-text">' + place.reviews[j].text + '</p>'
          reviewsHtml += '<p class="review-author">' + place.reviews[j].author_name + '</p>'
          reviewsHtml += '<span class="review-rating">' + place.reviews[j].rating + '</span>'
         // user_idHtml +=  (place.reviews[j].author_url) 
         // avartaHtml = user_idHtml.substr(24);
 //   document.getElementById('iw-reviews').style.display = '';
  //   document.getElementById('res-reviews').innerHTML = reviewsHtml;
     }
   }
   return ResImageHtml +reviewsHtml+urlHtml;
 //  console.log(reviewsHtml);
 
}

function ShowRestaurant(place_id){
    placeService = new google.maps.places.PlacesService(map);
    placeService.getDetails({
        placeId: place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          map.panTo(place.geometry.location);
          map.setZoom(13);
          map.addListener('idle', searchRestaurant);
        }
      });
}
function searchRestaurant() {
 
  var search = {
    bounds: map.getBounds(),
    types: ['restaurant'],
    keyword:   " (restaurant) OR (food)"
  };
   placeService.radarSearch(search, callback);
}
function ShowMuseum(place_id){
    
    placeService = new google.maps.places.PlacesService(map);
    placeService.getDetails({
        placeId: place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          clearMarkers();
          clearResults();
          map.panTo(place.geometry.location);
          map.setZoom(13);
          map.addListener('idle', searchMuseum);
        }
      });
}
function searchMuseum() {
  var search = {
    bounds: map.getBounds(),
    types: ['museum'],
    keyword:  " (attractions) OR (point_of_interest)OR (establishment) "
  };
   placeService.radarSearch(search, callback);
}
function ShowAttractions(place_id){
    placeService = new google.maps.places.PlacesService(map);
    placeService.getDetails({
        placeId: place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          map.panTo(place.geometry.location);
          map.setZoom(13);
          map.addListener('idle', searchPark);
        }
      });
}
function searchAttractions() {
 
  var search = {
    bounds: map.getBounds(),
    types: ['park','zoo','amusement_park','church'],
    keyword:  " (attractions) OR (point_of_interest)OR (establishment) "
  };
   placeService.radarSearch(search, callback);
}


    

