// Create the map
const mymap = L.map('map', { zoomControl: false });

// Get the tiles for map and add to map
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1Ijoicm9oYWlsNzciLCJhIjoiY2trbzAxY3Q4MXE4bzJ3bXphODdoOHo1ZyJ9.R5IKmDg9LOtEF1Xbyn9Ixg',
  }
).addTo(mymap);

// Create the map marker icon
const myIcon = L.icon({
  iconUrl: '../images/icon-location.svg',
  iconSize: [34, 44],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

/** Get The Location Of An IP Address **/
const getLocation = async ipAddress => {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=at_JAd6W8en7KlzOcbZ2aHHMe7gZkFzU&ipAddress=${ipAddress}`
    );
    const data = await response.json();
    displayLocation(data);
  } catch (err) {
    throw err;
  }
};

/** Display The Location On Map And It's Details **/
const displayLocation = data => {
  mymap.setView([data.location.lat, data.location.lng], 13);
  L.marker([data.location.lat, data.location.lng], { icon: myIcon }).addTo(
    mymap
  );
  document.getElementById('ip-address').innerHTML = data.ip;
  document.getElementById(
    'location'
  ).innerHTML = `${data.location.region}, ${data.location.city} ${data.location.postalCode}, ${data.location.country}`;
  document.getElementById(
    'timezone'
  ).innerHTML = `UTC ${data.location.timezone}`;
  document.getElementById('isp').innerHTML = data.isp;
};

const showFetchError = () => {
  document.querySelector('.main').style.display = 'none';
  document.querySelector('header').style.display = 'none';
  document.querySelector('.fetch-error').style.display = 'flex';
};

/** Get Clients IP And Location On Initial Load Of Page **/
(async function () {
  try {
    const response = await fetch(`https://api.ipify.org/?format=json`);
    const data = await response.json();
    document.getElementById('ip-address-input').value = data.ip;
    getLocation(data.ip);
  } catch (err) {
    showFetchError();
    throw err;
  }
})();

document.querySelector('.submit-btn').addEventListener('click', e => {
  e.preventDefault();
  const ipAddress = document.getElementById('ip-address-input').value;
  getLocation(ipAddress);
});
