import{Component as e,registerComponent as a}from"webact";import"leaflet";class s extends e{constructor(){super(import.meta.url),this._loaded=!1}get leafletMap(){return this.map}componentDidMount(){this.map=L.map(this.$("#map"),{crs:L.CRS.EPSG3857,continuousWorld:!0,center:[59.9573174,15.4233244],zoom:6});const t=L.tileLayer.wms("https://mapslantmateriet.havochvatten.se/topowebb/wms/v1?",{layers:"topowebbkartan",detectRetina:!0});this.map.addLayer(t),window.dispatchEvent(new Event("resize")),document.dispatchEvent(new CustomEvent("map:ready"))}render(){return`
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
    `}}var l=a(s,{name:"lantmateriet-karta"});export{l as default};
