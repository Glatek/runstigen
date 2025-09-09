import L from 'leaflet';
import 'leaflet.markercluster';

import { LantmaterietKarta } from './components/lantmateriet-karta.js';
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

function getIconForFeature (feature: GeoJSON.Feature) {
  if (feature.properties?.type === 'SVENSKA_GODS_OCH_GÅRDAR') {
    return overnightCabinIcon;
  }

  return undefinedIcon;
}

function getPathWithoutFilename(url: string) {
  const urlObj = new URL(url, document.location.href);

  return urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/'));
}

async function onEachFeature(feature: GeoJSON.Feature, layer: L.Layer, path: string) {
  const url = new URL(getPathWithoutFilename(path)+ '/' + feature.properties?.data, document.location.href);

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

async function loadMarkersFromJSON(map: L.Map, path: string, color?: string, fillColor?: string) {
  const response = await fetch(path);
  const json = await response.json();

  const pointToLayer = (feature: GeoJSON.Feature, latlng: L.LatLng) => L.marker(latlng, { icon: getIconForFeature(feature) });

  const markers = L.markerClusterGroup();

  L.geoJSON(json, { pointToLayer, onEachFeature: (feature, layer) => onEachFeature(feature, layer, path) }).addTo(markers);

  markers.addTo(map);

  return markers;
}

const loadSgog = (map: L.Map) => loadMarkersFromJSON(
  map,
  'data/sgog/s/collection.json'
);

async function loadMarkers (map: L.Map) {
  const sgogMarkers = await loadSgog(map);

  const group = new L.FeatureGroup([
    ...sgogMarkers.getLayers()
  ]);

  map.fitBounds(group.getBounds());
}

document.addEventListener('map:ready', () => {
  const map = document.querySelector('lantmateriet-karta');

  if (map instanceof LantmaterietKarta) {
    const { leafletMap } = map;

    if (leafletMap) {
      loadMarkers(leafletMap);

      leafletMap.on('click', event => {
        const { lat, lng } = leafletMap.mouseEventToLatLng(event.originalEvent);
        console.log(JSON.stringify([lng, lat]));
      });
    }
  }
});
