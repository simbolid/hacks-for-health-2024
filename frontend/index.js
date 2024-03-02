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

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

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
    zoom: 12,
    disableDefaultUI: true,
    zoomControl: true,
  });
}

initMap();
