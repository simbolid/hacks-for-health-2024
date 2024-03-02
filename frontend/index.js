let map;

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

function addTitleOverlay(map, titleText) {
    const titleOverlayDiv = document.createElement('div');
    titleOverlayDiv.classList.add('map-title-overlay');
    titleOverlayDiv.textContent = titleText;

    // Set the overlay position
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(titleOverlayDiv);
}

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );

  let mapCenter;

  try {
    mapCenter = await getUserLocation();
  } catch(error) {
    mapCenter = { lat: -34.397, lng: 150.644 }; // documentation default
    console.error(error.message);
  }

  map = new Map(document.getElementById("map"), {
    mapId: "2dc738ddf4d518a4",
    center: mapCenter,
    zoom: 14,
    disableDefaultUI: true,
    zoomControl: true,
  });

  addTitleOverlay(map, "Solace Space")

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

  const infoWindow = new InfoWindow();  // shared between markers

  for (const msg of messages) {
    const pin = new PinElement({
      background: "#122A40",
      borderColor: "#091520",
      glyph: "",
      scale: 0.8
    });

    const marker = new AdvancedMarkerElement({
      map,
      position: msg.position,
      title: msg.message,
      content: pin.element
    });

    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.title);
      infoWindow.open(marker.map, marker);
    });
  }
}

initMap();
