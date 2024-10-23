import './components/lantmateriet-karta.js';
import './components/folklore-article.js';

const overnightCabinIcon = L.icon({
  iconUrl: 'img/overnight-cabin.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

const undefinedIcon = L.icon({
  iconUrl: 'img/undefined.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

function isApple (userAgent = navigator.userAgent) {
  const iPad = userAgent.match(/iPad/i);
  const iPhone = userAgent.match(/iPhone/i);
  const Safari = userAgent.match(/Safari/i);

  return Boolean(iPad || iPhone || Safari);
}

function getIconForFeature (feature) {
  if (feature.properties.type === 'SVENSKA_GODS_OCH_GÅRDAR') {
    return overnightCabinIcon;
  }

  return undefinedIcon;
}

function getPathWithoutFilename(url) {
  const urlObj = new URL(url, document.location.href);

  return urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/'));
}

async function onEachFeature(feature, layer, path) {
  const url = new URL(getPathWithoutFilename(path)+ '/' + feature.properties.data, document.location.href);

  if (feature.properties) {
    const popupContent = [];

    if ('data' in feature.properties) {
      layer.on('click', () => {
        document.dispatchEvent(new CustomEvent('info:display', {
          detail: {
            url
          }
        }));
      }, false);
      return;
    }

    if (feature.properties.title) {
      popupContent.push(`<b>${feature.properties.title}</b>`);
    }

    if (feature.properties.type !== 'FARM') {
      popupContent.push(`Glaskogennummer: ${feature.properties.glaskogenNumber || 'okänt'}`);
    }

    if (feature.properties.bedCount) {
      popupContent.push(`Bäddar: ${feature.properties.bedCount}`);
    }

    if (feature.properties.desc) {
      popupContent.push(`${feature.properties.desc}`);
    }

    // popupContent.push(feature.geometry.coordinates.join(', '));

    layer.bindPopup(popupContent.join('<br>'));
  }
}

async function loadMarkersFromJSON({ map, path, color, fillColor }) {
  const response = await fetch(path);
  const json = await response.json();

  const pointToLayer = (feature, latlng) => L.marker(latlng, { icon: getIconForFeature(feature) });

  const markers = L.markerClusterGroup();

  L.geoJSON(json, { pointToLayer, onEachFeature: (feature, layer) => onEachFeature(feature, layer, path) }).addTo(markers);

  markers.addTo(map);

  return markers;
}

const loadSgog = map => loadMarkersFromJSON({
  map,
  path: 'data/sgog/s/collection.json'
});

async function loadMarkers (map) {
  const sgogMarkers = await loadSgog(map);

  const group = new L.featureGroup([
    ...sgogMarkers.getLayers()
  ]);

  map.fitBounds(group.getBounds());
}

document.querySelector('header button').addEventListener('click', () => {
  const buyWindow = document.querySelector('glaskogencard-buy');
  const open = buyWindow.getAttribute('open');

  if (open) {
    buyWindow.removeAttribute('open');
  } else {
    buyWindow.setAttribute('open', '');
  }
})

document.addEventListener('map:ready', () => {
  const { leafletMap: map } = document.querySelector('lantmateriet-karta');

  loadMarkers(map);

  map.on('click', function(ev){
    const { lat, lng } = map.mouseEventToLatLng(ev.originalEvent);
    console.log(JSON.stringify([lng, lat]));
  });
});
