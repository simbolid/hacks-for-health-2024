/*
 * Google Map Javascript API Imports
 */
const { Map, InfoWindow } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
  "marker"
);

/*
 * Globals
 */
let map;
let mapCenter;
let tempMarkerLocation = null;  // used when setting the location for a new msg

try {
  mapCenter = await getUserLocation();
} catch(error) {
  mapCenter = { lat: 40.62966, lng: -75.37247 };  // liberty high school
  console.error(error.message);
}

const messages = [
  {
    position: { lat: mapCenter.lat, lng: mapCenter.lng },
    message: "I love it here.",
  },

  {
    position: { lat: mapCenter.lat + .01, lng: mapCenter.lng - .01 },
    message: "I hate it here.",
  },
];

const messageWindow = new InfoWindow();  // shared between markers

/*
 * Helper Functions
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          reject(new Error("Unable to retrieve your location."));
        }
      );
    }
  });
}

function addTitleOverlay(titleText) {
  const titleOverlayDiv = document.createElement('div');
  titleOverlayDiv.classList.add('map-title-overlay');
  titleOverlayDiv.textContent = titleText;

  // Set the overlay position
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(titleOverlayDiv);
}

function addNewMarkerButton() {
  const addMarkerButton = document.createElement('img');
  addMarkerButton.src = './assets/plus-circle-outline.png';
  addMarkerButton.classList.add('map-add-marker-btn');

  addMarkerButton.onclick = () => {
      document.getElementById('markerForm').classList.add('active');
  };

  document.getElementById('closeFormBtn').onclick = () => {
      document.getElementById('markerForm').classList.remove('active');
  };

  document.querySelector('#submitButton').addEventListener('click', handleFormSubmit);

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(addMarkerButton);
}

function placeMarker(position, message) {
  const pin = new PinElement({
    background: "#122A40",
    borderColor: "#091520",
    glyph: "",
    scale: 0.8
  });

  const marker = new AdvancedMarkerElement({
    map,
    position,
    title: message,
    content: pin.element
  });

  marker.addListener("click", () => {
    messageWindow.close();
    messageWindow.setContent(
      `<div class="info-window-content">${marker.title}</div>`
    );
    messageWindow.open(marker.map, marker);
  });
}

/*
 * Driver Code
 */
function handleFormSubmit() {
  const message = document.getElementById('message').value;
  if (tempMarkerLocation && message) {
    placeMarker(tempMarkerLocation, message)
    
    // Reset temp location and hide form
    tempMarkerLocation = null;
    document.getElementById('markerForm').classList.remove('active');
    document.getElementById('message').value = ''; // Clear the message field
  }
}

function initMap() {
  map = new Map(document.getElementById("map"), {
    mapId: "2dc738ddf4d518a4",
    center: mapCenter,
    zoom: 14,
    disableDefaultUI: true,
    zoomControl: true,
  });

  addTitleOverlay("Solace Space");
  addNewMarkerButton();

  // listen for map clicks to set the temporary marker location
  map.addListener('click', function(e) {
    tempMarkerLocation = e.latLng;
  });

  for (const msg of messages) {
    placeMarker(msg.position, msg.message);
  }
}

initMap();
