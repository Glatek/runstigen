import { Component, registerComponent } from 'webact';

import 'leaflet';

class LantmaterietKarta extends Component {
  constructor () {
    super(import.meta.url);

    this._loaded = false;
  }

  get leafletMap () {
    return this.map;
  }

  componentDidMount () {
    this.map = L.map(this.$('#map'), {
      crs: L.CRS.EPSG3857,
      continuousWorld: true,
      center: [59.9573174, 15.4233244],
      zoom: 6
    });

    const lantmateriet = L.tileLayer.wms('https://mapslantmateriet.havochvatten.se/topowebb/wms/v1?', {
      layers: 'topowebbkartan',
      detectRetina: true
    });

    this.map.addLayer(lantmateriet);

    window.dispatchEvent(new Event('resize'));
    document.dispatchEvent(new CustomEvent('map:ready'));
  }

  render () {
    return `
      <link rel="stylesheet" href="dist/libs/leaflet.css" />
      <link rel="stylesheet" href="dist/libs/leaflet.markercluster.css">
      <style>
      :host,
      #map {
        display: block;
        width: 100%;
        height: 100%;
      }
      </style>
      <div id="map" data-tap-disabled="true"></div>
    `;
  }
}

export default registerComponent(LantmaterietKarta, {
  name: 'lantmateriet-karta'
});
