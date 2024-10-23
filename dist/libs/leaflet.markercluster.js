var O=Object.create;var P=Object.defineProperty;var G=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var Z=Object.getPrototypeOf,B=Object.prototype.hasOwnProperty;var E=(d,c)=>()=>(c||d((c={exports:{}}).exports,c),c.exports);var S=(d,c,m,e)=>{if(c&&typeof c=="object"||typeof c=="function")for(let t of I(c))!B.call(d,t)&&t!==m&&P(d,t,{get:()=>c[t],enumerable:!(e=G(c,t))||e.enumerable});return d},k=(d,c,m)=>(S(d,c,"default"),m&&S(m,c,"default")),T=(d,c,m)=>(m=d!=null?O(Z(d)):{},S(c||!d||!d.__esModule?P(m,"default",{value:d,enumerable:!0}):m,d));var x=E((M,b)=>{(function(d,c){typeof M=="object"&&typeof b<"u"?c(M):typeof define=="function"&&define.amd?define(["exports"],c):(d=d||self,c((d.Leaflet=d.Leaflet||{},d.Leaflet.markercluster={})))})(M,function(d){"use strict";var c=L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,clusterPane:L.Marker.prototype.options.pane,spiderfyOnEveryZoom:!1,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animate:!0,animateAddingMarkers:!1,spiderfyShapePositions:null,spiderfyDistanceMultiplier:1,spiderLegPolylineOptions:{weight:1.5,color:"#222",opacity:.5},chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(e){L.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.addEventParent(this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.addEventParent(this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[],this._childMarkerEventHandlers={dragstart:this._childMarkerDragStart,move:this._childMarkerMoved,dragend:this._childMarkerDragEnd};var t=L.DomUtil.TRANSITION&&this.options.animate;L.extend(this,t?this._withAnimation:this._noAnimation),this._markerCluster=t?L.MarkerCluster:L.MarkerClusterNonAnimated},addLayer:function(e){if(e instanceof L.LayerGroup)return this.addLayers([e]);if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this.fire("layeradd",{layer:e}),this;if(!this._map)return this._needsClustering.push(e),this.fire("layeradd",{layer:e}),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom),this.fire("layeradd",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons();var t=e,i=this._zoom;if(e.__parent)for(;t.__parent._zoom>=i;)t=t.__parent;return this._currentShownBounds.contains(t.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,t):this._animationAddLayerNonAnimated(e,t)),this},removeLayer:function(e){return e instanceof L.LayerGroup?this.removeLayers([e]):e.getLatLng?this._map?e.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this.fire("layerremove",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),e.off(this._childMarkerEventHandlers,this),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow()),this):this:(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push({layer:e,latlng:e._latlng}),this.fire("layerremove",{layer:e}),this):(this._nonPointGroup.removeLayer(e),this.fire("layerremove",{layer:e}),this)},addLayers:function(e,t){if(!L.Util.isArray(e))return this.addLayer(e);var i=this._featureGroup,n=this._nonPointGroup,s=this.options.chunkedLoading,o=this.options.chunkInterval,r=this.options.chunkProgress,h=e.length,a=0,u=!0,l;if(this._map){var f=new Date().getTime(),_=L.bind(function(){var g=new Date().getTime();for(this._map&&this._unspiderfy&&this._unspiderfy();a<h;a++){if(s&&a%200===0){var C=new Date().getTime()-g;if(C>o)break}if(l=e[a],l instanceof L.LayerGroup){u&&(e=e.slice(),u=!1),this._extractNonGroupLayers(l,e),h=e.length;continue}if(!l.getLatLng){n.addLayer(l),t||this.fire("layeradd",{layer:l});continue}if(!this.hasLayer(l)&&(this._addLayer(l,this._maxZoom),t||this.fire("layeradd",{layer:l}),l.__parent&&l.__parent.getChildCount()===2)){var v=l.__parent.getAllChildMarkers(),w=v[0]===l?v[1]:v[0];i.removeLayer(w)}}r&&r(a,h,new Date().getTime()-f),a===h?(this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(_,this.options.chunkDelay)},this);_()}else for(var p=this._needsClustering;a<h;a++){if(l=e[a],l instanceof L.LayerGroup){u&&(e=e.slice(),u=!1),this._extractNonGroupLayers(l,e),h=e.length;continue}if(!l.getLatLng){n.addLayer(l);continue}this.hasLayer(l)||p.push(l)}return this},removeLayers:function(e){var t,i,n=e.length,s=this._featureGroup,o=this._nonPointGroup,r=!0;if(!this._map){for(t=0;t<n;t++){if(i=e[t],i instanceof L.LayerGroup){r&&(e=e.slice(),r=!1),this._extractNonGroupLayers(i,e),n=e.length;continue}this._arraySplice(this._needsClustering,i),o.removeLayer(i),this.hasLayer(i)&&this._needsRemoving.push({layer:i,latlng:i._latlng}),this.fire("layerremove",{layer:i})}return this}if(this._unspiderfy){this._unspiderfy();var h=e.slice(),a=n;for(t=0;t<a;t++){if(i=h[t],i instanceof L.LayerGroup){this._extractNonGroupLayers(i,h),a=h.length;continue}this._unspiderfyLayer(i)}}for(t=0;t<n;t++){if(i=e[t],i instanceof L.LayerGroup){r&&(e=e.slice(),r=!1),this._extractNonGroupLayers(i,e),n=e.length;continue}if(!i.__parent){o.removeLayer(i),this.fire("layerremove",{layer:i});continue}this._removeLayer(i,!0,!0),this.fire("layerremove",{layer:i}),s.hasLayer(i)&&(s.removeLayer(i),i.clusterShow&&i.clusterShow())}return this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),this},clearLayers:function(){return this._map||(this._needsClustering=[],this._needsRemoving=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(e){e.off(this._childMarkerEventHandlers,this),delete e.__parent},this),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new L.LatLngBounds;this._topClusterLevel&&e.extend(this._topClusterLevel._bounds);for(var t=this._needsClustering.length-1;t>=0;t--)e.extend(this._needsClustering[t].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(e,t){var i=this._needsClustering.slice(),n=this._needsRemoving,s,o,r;for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(i),o=i.length-1;o>=0;o--){for(s=!0,r=n.length-1;r>=0;r--)if(n[r].layer===i[o]){s=!1;break}s&&e.call(t,i[o])}this._nonPointGroup.eachLayer(e,t)},getLayers:function(){var e=[];return this.eachLayer(function(t){e.push(t)}),e},getLayer:function(e){var t=null;return e=parseInt(e,10),this.eachLayer(function(i){L.stamp(i)===e&&(t=i)}),t},hasLayer:function(e){if(!e)return!1;var t,i=this._needsClustering;for(t=i.length-1;t>=0;t--)if(i[t]===e)return!0;for(i=this._needsRemoving,t=i.length-1;t>=0;t--)if(i[t].layer===e)return!1;return!!(e.__parent&&e.__parent._group===this)||this._nonPointGroup.hasLayer(e)},zoomToShowLayer:function(e,t){var i=this._map;typeof t!="function"&&(t=function(){});var n=function(){(i.hasLayer(e)||i.hasLayer(e.__parent))&&!this._inZoomAnimation&&(this._map.off("moveend",n,this),this.off("animationend",n,this),i.hasLayer(e)?t():e.__parent._icon&&(this.once("spiderfied",t,this),e.__parent.spiderfy()))};e._icon&&this._map.getBounds().contains(e.getLatLng())?t():e.__parent._zoom<Math.round(this._map._zoom)?(this._map.on("moveend",n,this),this._map.panTo(e.getLatLng())):(this._map.on("moveend",n,this),this.on("animationend",n,this),e.__parent.zoomToBounds())},onAdd:function(e){this._map=e;var t,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.addTo(e),this._nonPointGroup.addTo(e),this._gridClusters||this._generateInitialClusters(),this._maxLat=e.options.crs.projection.MAX_LATITUDE,t=0,i=this._needsRemoving.length;t<i;t++)n=this._needsRemoving[t],n.newlatlng=n.layer._latlng,n.layer._latlng=n.latlng;for(t=0,i=this._needsRemoving.length;t<i;t++)n=this._needsRemoving[t],this._removeLayer(n.layer,!0),n.layer._latlng=n.newlatlng;this._needsRemoving=[],this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i,!0)},onRemove:function(e){e.off("zoomend",this._zoomEnd,this),e.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),delete this._maxLat,this._hideCoverage(),this._featureGroup.remove(),this._nonPointGroup.remove(),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(e){for(var t=e;t&&!t._icon;)t=t.__parent;return t||null},_arraySplice:function(e,t){for(var i=e.length-1;i>=0;i--)if(e[i]===t)return e.splice(i,1),!0},_removeFromGridUnclustered:function(e,t){for(var i=this._map,n=this._gridUnclustered,s=Math.floor(this._map.getMinZoom());t>=s&&n[t].removeObject(e,i.project(e.getLatLng(),t));t--);},_childMarkerDragStart:function(e){e.target.__dragStart=e.target._latlng},_childMarkerMoved:function(e){if(!this._ignoreMove&&!e.target.__dragStart){var t=e.target._popup&&e.target._popup.isOpen();this._moveChild(e.target,e.oldLatLng,e.latlng),t&&e.target.openPopup()}},_moveChild:function(e,t,i){e._latlng=t,this.removeLayer(e),e._latlng=i,this.addLayer(e)},_childMarkerDragEnd:function(e){var t=e.target.__dragStart;delete e.target.__dragStart,t&&this._moveChild(e.target,t,e.target._latlng)},_removeLayer:function(e,t,i){var n=this._gridClusters,s=this._gridUnclustered,o=this._featureGroup,r=this._map,h=Math.floor(this._map.getMinZoom());t&&this._removeFromGridUnclustered(e,this._maxZoom);var a=e.__parent,u=a._markers,l;for(this._arraySplice(u,e);a&&(a._childCount--,a._boundsNeedUpdate=!0,!(a._zoom<h));)t&&a._childCount<=1?(l=a._markers[0]===e?a._markers[1]:a._markers[0],n[a._zoom].removeObject(a,r.project(a._cLatLng,a._zoom)),s[a._zoom].addObject(l,r.project(l.getLatLng(),a._zoom)),this._arraySplice(a.__parent._childClusters,a),a.__parent._markers.push(l),l.__parent=a.__parent,a._icon&&(o.removeLayer(a),i||o.addLayer(l))):a._iconNeedsUpdate=!0,a=a.__parent;delete e.__parent},_isOrIsParent:function(e,t){for(;t;){if(e===t)return!0;t=t.parentNode}return!1},fire:function(e,t,i){if(t&&t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;e="cluster"+e}L.FeatureGroup.prototype.fire.call(this,e,t,i)},listens:function(e,t){return L.FeatureGroup.prototype.listens.call(this,e,t)||L.FeatureGroup.prototype.listens.call(this,"cluster"+e,t)},_defaultIconCreateFunction:function(e){var t=e.getChildCount(),i=" marker-cluster-";return t<10?i+="small":t<100?i+="medium":i+="large",new L.DivIcon({html:"<div><span>"+t+"</span></div>",className:"marker-cluster"+i,iconSize:new L.Point(40,40)})},_bindEvents:function(){var e=this._map,t=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick,s=this.options.spiderfyOnEveryZoom;(t||n||s)&&this.on("clusterclick clusterkeypress",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),e.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(e){var t=e.layer,i=t;if(!(e.type==="clusterkeypress"&&e.originalEvent&&e.originalEvent.keyCode!==13)){for(;i._childClusters.length===1;)i=i._childClusters[0];i._zoom===this._maxZoom&&i._childCount===t._childCount&&this.options.spiderfyOnMaxZoom?t.spiderfy():this.options.zoomToBoundsOnClick&&t.zoomToBounds(),this.options.spiderfyOnEveryZoom&&t.spiderfy(),e.originalEvent&&e.originalEvent.keyCode===13&&this._map._container.focus()}},_showCoverage:function(e){var t=this._map;this._inZoomAnimation||(this._shownPolygon&&t.removeLayer(this._shownPolygon),e.layer.getChildCount()>2&&e.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),t.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var e=this.options.spiderfyOnMaxZoom,t=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this.options.spiderfyOnEveryZoom,s=this._map;(e||i||n)&&this.off("clusterclick clusterkeypress",this._zoomOrSpiderfy,this),t&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),s.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var e=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,Math.round(this._map._zoom),e),this._currentShownBounds=e}},_generateInitialClusters:function(){var e=Math.ceil(this._map.getMaxZoom()),t=Math.floor(this._map.getMinZoom()),i=this.options.maxClusterRadius,n=i;typeof i!="function"&&(n=function(){return i}),this.options.disableClusteringAtZoom!==null&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var s=e;s>=t;s--)this._gridClusters[s]=new L.DistanceGrid(n(s)),this._gridUnclustered[s]=new L.DistanceGrid(n(s));this._topClusterLevel=new this._markerCluster(this,t-1)},_addLayer:function(e,t){var i=this._gridClusters,n=this._gridUnclustered,s=Math.floor(this._map.getMinZoom()),o,r;for(this.options.singleMarkerMode&&this._overrideMarkerIcon(e),e.on(this._childMarkerEventHandlers,this);t>=s;t--){o=this._map.project(e.getLatLng(),t);var h=i[t].getNearObject(o);if(h){h._addChild(e),e.__parent=h;return}if(h=n[t].getNearObject(o),h){var a=h.__parent;a&&this._removeLayer(h,!1);var u=new this._markerCluster(this,t,h,e);i[t].addObject(u,this._map.project(u._cLatLng,t)),h.__parent=u,e.__parent=u;var l=u;for(r=t-1;r>a._zoom;r--)l=new this._markerCluster(this,r,l),i[r].addObject(l,this._map.project(h.getLatLng(),r));a._addChild(l),this._removeFromGridUnclustered(h,t);return}n[t].addObject(e,o)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_refreshClustersIcons:function(){this._featureGroup.eachLayer(function(e){e instanceof L.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()})},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var e=0;e<this._queue.length;e++)this._queue[e].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){var e=Math.round(this._map._zoom);this._processQueue(),this._zoom<e&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,e)):this._zoom>e?(this._animationStart(),this._animationZoomOut(this._zoom,e)):this._moveEnd()},_getExpandedVisibleBounds:function(){if(this.options.removeOutsideVisibleBounds){if(L.Browser.mobile)return this._checkBoundsMaxLat(this._map.getBounds())}else return this._mapBoundsInfinite;return this._checkBoundsMaxLat(this._map.getBounds().pad(1))},_checkBoundsMaxLat:function(e){var t=this._maxLat;return t!==void 0&&(e.getNorth()>=t&&(e._northEast.lat=1/0),e.getSouth()<=-t&&(e._southWest.lat=-1/0)),e},_animationAddLayerNonAnimated:function(e,t){if(t===e)this._featureGroup.addLayer(e);else if(t._childCount===2){t._addToMap();var i=t.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else t._updateIcon()},_extractNonGroupLayers:function(e,t){var i=e.getLayers(),n=0,s;for(t=t||[];n<i.length;n++){if(s=i[n],s instanceof L.LayerGroup){this._extractNonGroupLayers(s,t);continue}t.push(s)}return t},_overrideMarkerIcon:function(e){var t=e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}});return t}});L.MarkerClusterGroup.include({_mapBoundsInfinite:new L.LatLngBounds(new L.LatLng(-1/0,-1/0),new L.LatLng(1/0,1/0))}),L.MarkerClusterGroup.include({_noAnimation:{_animationStart:function(){},_animationZoomIn:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(e,t){this._animationAddLayerNonAnimated(e,t)}},_withAnimation:{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationZoomIn:function(e,t){var i=this._getExpandedVisibleBounds(),n=this._featureGroup,s=Math.floor(this._map.getMinZoom()),o;this._ignoreMove=!0,this._topClusterLevel._recursively(i,e,s,function(r){var h=r._latlng,a=r._markers,u;for(i.contains(h)||(h=null),r._isSingleParent()&&e+1===t?(n.removeLayer(r),r._recursivelyAddChildrenToMap(null,t,i)):(r.clusterHide(),r._recursivelyAddChildrenToMap(h,t,i)),o=a.length-1;o>=0;o--)u=a[o],i.contains(u._latlng)||n.removeLayer(u)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(i,t),n.eachLayer(function(r){!(r instanceof L.MarkerCluster)&&r._icon&&r.clusterShow()}),this._topClusterLevel._recursively(i,e,t,function(r){r._recursivelyRestoreChildPositions(t)}),this._ignoreMove=!1,this._enqueue(function(){this._topClusterLevel._recursively(i,e,s,function(r){n.removeLayer(r),r.clusterShow()}),this._animationEnd()})},_animationZoomOut:function(e,t){this._animationZoomOutSingle(this._topClusterLevel,e-1,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e,this._getExpandedVisibleBounds())},_animationAddLayer:function(e,t){var i=this,n=this._featureGroup;n.addLayer(e),t!==e&&(t._childCount>2?(t._updateIcon(),this._forceLayout(),this._animationStart(),e._setPos(this._map.latLngToLayerPoint(t.getLatLng())),e.clusterHide(),this._enqueue(function(){n.removeLayer(e),e.clusterShow(),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(t,this._map.getMaxZoom(),this._zoom)))}},_animationZoomOutSingle:function(e,t,i){var n=this._getExpandedVisibleBounds(),s=Math.floor(this._map.getMinZoom());e._recursivelyAnimateChildrenInAndAddSelfToMap(n,s,t+1,i);var o=this;this._forceLayout(),e._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(e._childCount===1){var r=e._markers[0];this._ignoreMove=!0,r.setLatLng(r.getLatLng()),this._ignoreMove=!1,r.clusterShow&&r.clusterShow()}else e._recursively(n,i,s,function(h){h._recursivelyRemoveChildrenFromMap(n,s,t+1)});o._animationEnd()})},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_forceLayout:function(){L.Util.falseFn(document.body.offsetWidth)}}),L.markerClusterGroup=function(e){return new L.MarkerClusterGroup(e)};var m=L.MarkerCluster=L.Marker.extend({options:L.Icon.prototype.options,initialize:function(e,t,i,n){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this,pane:e.options.clusterPane}),this._group=e,this._zoom=t,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(e,t){e=e||[];for(var i=this._childClusters.length-1;i>=0;i--)this._childClusters[i].getAllChildMarkers(e,t);for(var n=this._markers.length-1;n>=0;n--)t&&this._markers[n].__dragStart||e.push(this._markers[n]);return e},getChildCount:function(){return this._childCount},zoomToBounds:function(e){for(var t=this._childClusters.slice(),i=this._group._map,n=i.getBoundsZoom(this._bounds),s=this._zoom+1,o=i.getZoom(),r;t.length>0&&n>s;){s++;var h=[];for(r=0;r<t.length;r++)h=h.concat(t[r]._childClusters);t=h}n>s?this._group._map.setView(this._latlng,s):n<=o?this._group._map.setView(this._latlng,o+1):this._group._map.fitBounds(this._bounds,e)},getBounds:function(){var e=new L.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,t){this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._setClusterCenter(e),e instanceof L.MarkerCluster?(t||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(t||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_setClusterCenter:function(e){this._cLatLng||(this._cLatLng=e._cLatLng||e._latlng)},_resetBounds:function(){var e=this._bounds;e._southWest&&(e._southWest.lat=1/0,e._southWest.lng=1/0),e._northEast&&(e._northEast.lat=-1/0,e._northEast.lng=-1/0)},_recalculateBounds:function(){var e=this._markers,t=this._childClusters,i=0,n=0,s=this._childCount,o,r,h,a;if(s!==0){for(this._resetBounds(),o=0;o<e.length;o++)h=e[o]._latlng,this._bounds.extend(h),i+=h.lat,n+=h.lng;for(o=0;o<t.length;o++)r=t[o],r._boundsNeedUpdate&&r._recalculateBounds(),this._bounds.extend(r._bounds),h=r._wLatLng,a=r._childCount,i+=h.lat*a,n+=h.lng*a;this._latlng=this._wLatLng=new L.LatLng(i/s,n/s),this._boundsNeedUpdate=!1}},_addToMap:function(e){e&&(this._backupLatlng=this._latlng,this.setLatLng(e)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(e,t,i){this._recursively(e,this._group._map.getMinZoom(),i-1,function(n){var s=n._markers,o,r;for(o=s.length-1;o>=0;o--)r=s[o],r._icon&&(r._setPos(t),r.clusterHide())},function(n){var s=n._childClusters,o,r;for(o=s.length-1;o>=0;o--)r=s[o],r._icon&&(r._setPos(t),r.clusterHide())})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(e,t,i,n){this._recursively(e,n,t,function(s){s._recursivelyAnimateChildrenIn(e,s._group._map.latLngToLayerPoint(s.getLatLng()).round(),i),s._isSingleParent()&&i-1===n?(s.clusterShow(),s._recursivelyRemoveChildrenFromMap(e,t,i)):s.clusterHide(),s._addToMap()})},_recursivelyBecomeVisible:function(e,t){this._recursively(e,this._group._map.getMinZoom(),t,null,function(i){i.clusterShow()})},_recursivelyAddChildrenToMap:function(e,t,i){this._recursively(i,this._group._map.getMinZoom()-1,t,function(n){if(t!==n._zoom)for(var s=n._markers.length-1;s>=0;s--){var o=n._markers[s];i.contains(o._latlng)&&(e&&(o._backupLatlng=o.getLatLng(),o.setLatLng(e),o.clusterHide&&o.clusterHide()),n._group._featureGroup.addLayer(o))}},function(n){n._addToMap(e)})},_recursivelyRestoreChildPositions:function(e){for(var t=this._markers.length-1;t>=0;t--){var i=this._markers[t];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(e-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var s=this._childClusters.length-1;s>=0;s--)this._childClusters[s]._recursivelyRestoreChildPositions(e)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(e,t,i,n){var s,o;this._recursively(e,t-1,i-1,function(r){for(o=r._markers.length-1;o>=0;o--)s=r._markers[o],(!n||!n.contains(s._latlng))&&(r._group._featureGroup.removeLayer(s),s.clusterShow&&s.clusterShow())},function(r){for(o=r._childClusters.length-1;o>=0;o--)s=r._childClusters[o],(!n||!n.contains(s._latlng))&&(r._group._featureGroup.removeLayer(s),s.clusterShow&&s.clusterShow())})},_recursively:function(e,t,i,n,s){var o=this._childClusters,r=this._zoom,h,a;if(t<=r&&(n&&n(this),s&&r===i&&s(this)),r<t||r<i)for(h=o.length-1;h>=0;h--)a=o[h],a._boundsNeedUpdate&&a._recalculateBounds(),e.intersects(a._bounds)&&a._recursively(e,t,i,n,s)},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}});L.Marker.include({clusterHide:function(){var e=this.options.opacity;return this.setOpacity(0),this.options.opacity=e,this},clusterShow:function(){return this.setOpacity(this.options.opacity)}}),L.DistanceGrid=function(e){this._cellSize=e,this._sqCellSize=e*e,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),s=this._grid,o=s[n]=s[n]||{},r=o[i]=o[i]||[],h=L.Util.stamp(e);this._objectPoint[h]=t,r.push(e)},updateObject:function(e,t){this.removeObject(e),this.addObject(e,t)},removeObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),s=this._grid,o=s[n]=s[n]||{},r=o[i]=o[i]||[],h,a;for(delete this._objectPoint[L.Util.stamp(e)],h=0,a=r.length;h<a;h++)if(r[h]===e)return r.splice(h,1),a===1&&delete o[i],!0},eachObject:function(e,t){var i,n,s,o,r,h,a,u=this._grid;for(i in u){r=u[i];for(n in r)for(h=r[n],s=0,o=h.length;s<o;s++)a=e.call(t,h[s]),a&&(s--,o--)}},getNearObject:function(e){var t=this._getCoord(e.x),i=this._getCoord(e.y),n,s,o,r,h,a,u,l,f=this._objectPoint,_=this._sqCellSize,p=null;for(n=i-1;n<=i+1;n++)if(r=this._grid[n],r){for(s=t-1;s<=t+1;s++)if(h=r[s],h)for(o=0,a=h.length;o<a;o++)u=h[o],l=this._sqDist(f[L.Util.stamp(u)],e),(l<_||l<=_&&p===null)&&(_=l,p=u)}return p},_getCoord:function(e){var t=Math.floor(e/this._cellSize);return isFinite(t)?t:e},_sqDist:function(e,t){var i=t.x-e.x,n=t.y-e.y;return i*i+n*n}},function(){L.QuickHull={getDistant:function(e,t){var i=t[1].lat-t[0].lat,n=t[0].lng-t[1].lng;return n*(e.lat-t[0].lat)+i*(e.lng-t[0].lng)},findMostDistantPointFromBaseLine:function(e,t){var i=0,n=null,s=[],o,r,h;for(o=t.length-1;o>=0;o--){if(r=t[o],h=this.getDistant(r,e),h>0)s.push(r);else continue;h>i&&(i=h,n=r)}return{maxPoint:n,newPoints:s}},buildConvexHull:function(e,t){var i=[],n=this.findMostDistantPointFromBaseLine(e,t);return n.maxPoint?(i=i.concat(this.buildConvexHull([e[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,e[1]],n.newPoints)),i):[e[0]]},getConvexHull:function(e){var t=!1,i=!1,n=!1,s=!1,o=null,r=null,h=null,a=null,u=null,l=null,f;for(f=e.length-1;f>=0;f--){var _=e[f];(t===!1||_.lat>t)&&(o=_,t=_.lat),(i===!1||_.lat<i)&&(r=_,i=_.lat),(n===!1||_.lng>n)&&(h=_,n=_.lng),(s===!1||_.lng<s)&&(a=_,s=_.lng)}i!==t?(l=r,u=o):(l=a,u=h);var p=[].concat(this.buildConvexHull([l,u],e),this.buildConvexHull([u,l],e));return p}}}(),L.MarkerCluster.include({getConvexHull:function(){var e=this.getAllChildMarkers(),t=[],i,n;for(n=e.length-1;n>=0;n--)i=e[n].getLatLng(),t.push(i);return L.QuickHull.getConvexHull(t)}}),L.MarkerCluster.include({_2PI:Math.PI*2,_circleFootSeparation:25,_circleStartAngle:0,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(!(this._group._spiderfied===this||this._group._inZoomAnimation)){var e=this.getAllChildMarkers(null,!0),t=this._group,i=t._map,n=i.latLngToLayerPoint(this._latlng),s;this._group._unspiderfy(),this._group._spiderfied=this,this._group.options.spiderfyShapePositions?s=this._group.options.spiderfyShapePositions(e.length,n):e.length>=this._circleSpiralSwitchover?s=this._generatePointsSpiral(e.length,n):(n.y+=10,s=this._generatePointsCircle(e.length,n)),this._animationSpiderfy(e,s)}},unspiderfy:function(e){this._group._inZoomAnimation||(this._animationUnspiderfy(e),this._group._spiderfied=null)},_generatePointsCircle:function(e,t){var i=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e),n=i/this._2PI,s=this._2PI/e,o=[],r,h;for(n=Math.max(n,35),o.length=e,r=0;r<e;r++)h=this._circleStartAngle+r*s,o[r]=new L.Point(t.x+n*Math.cos(h),t.y+n*Math.sin(h))._round();return o},_generatePointsSpiral:function(e,t){var i=this._group.options.spiderfyDistanceMultiplier,n=i*this._spiralLengthStart,s=i*this._spiralFootSeparation,o=i*this._spiralLengthFactor*this._2PI,r=0,h=[],a;for(h.length=e,a=e;a>=0;a--)a<e&&(h[a]=new L.Point(t.x+n*Math.cos(r),t.y+n*Math.sin(r))._round()),r+=s/n+a*5e-4,n+=o/r;return h},_noanimationUnspiderfy:function(){var e=this._group,t=e._map,i=e._featureGroup,n=this.getAllChildMarkers(null,!0),s,o;for(e._ignoreMove=!0,this.setOpacity(1),o=n.length-1;o>=0;o--)s=n[o],i.removeLayer(s),s._preSpiderfyLatlng&&(s.setLatLng(s._preSpiderfyLatlng),delete s._preSpiderfyLatlng),s.setZIndexOffset&&s.setZIndexOffset(0),s._spiderLeg&&(t.removeLayer(s._spiderLeg),delete s._spiderLeg);e.fire("unspiderfied",{cluster:this,markers:n}),e._ignoreMove=!1,e._spiderfied=null}}),L.MarkerClusterNonAnimated=L.MarkerCluster.extend({_animationSpiderfy:function(e,t){var i=this._group,n=i._map,s=i._featureGroup,o=this._group.options.spiderLegPolylineOptions,r,h,a,u;for(i._ignoreMove=!0,r=0;r<e.length;r++)u=n.layerPointToLatLng(t[r]),h=e[r],a=new L.Polyline([this._latlng,u],o),n.addLayer(a),h._spiderLeg=a,h._preSpiderfyLatlng=h._latlng,h.setLatLng(u),h.setZIndexOffset&&h.setZIndexOffset(1e6),s.addLayer(h);this.setOpacity(.3),i._ignoreMove=!1,i.fire("spiderfied",{cluster:this,markers:e})},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerCluster.include({_animationSpiderfy:function(e,t){var i=this,n=this._group,s=n._map,o=n._featureGroup,r=this._latlng,h=s.latLngToLayerPoint(r),a=L.Path.SVG,u=L.extend({},this._group.options.spiderLegPolylineOptions),l=u.opacity,f,_,p,g,C,v;for(l===void 0&&(l=L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),a?(u.opacity=0,u.className=(u.className||"")+" leaflet-cluster-spider-leg"):u.opacity=l,n._ignoreMove=!0,f=0;f<e.length;f++)_=e[f],v=s.layerPointToLatLng(t[f]),p=new L.Polyline([r,v],u),s.addLayer(p),_._spiderLeg=p,a&&(g=p._path,C=g.getTotalLength()+.1,g.style.strokeDasharray=C,g.style.strokeDashoffset=C),_.setZIndexOffset&&_.setZIndexOffset(1e6),_.clusterHide&&_.clusterHide(),o.addLayer(_),_._setPos&&_._setPos(h);for(n._forceLayout(),n._animationStart(),f=e.length-1;f>=0;f--)v=s.layerPointToLatLng(t[f]),_=e[f],_._preSpiderfyLatlng=_._latlng,_.setLatLng(v),_.clusterShow&&_.clusterShow(),a&&(p=_._spiderLeg,g=p._path,g.style.strokeDashoffset=0,p.setStyle({opacity:l}));this.setOpacity(.3),n._ignoreMove=!1,setTimeout(function(){n._animationEnd(),n.fire("spiderfied",{cluster:i,markers:e})},200)},_animationUnspiderfy:function(e){var t=this,i=this._group,n=i._map,s=i._featureGroup,o=e?n._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):n.latLngToLayerPoint(this._latlng),r=this.getAllChildMarkers(null,!0),h=L.Path.SVG,a,u,l,f,_,p;for(i._ignoreMove=!0,i._animationStart(),this.setOpacity(1),u=r.length-1;u>=0;u--)a=r[u],a._preSpiderfyLatlng&&(a.closePopup(),a.setLatLng(a._preSpiderfyLatlng),delete a._preSpiderfyLatlng,p=!0,a._setPos&&(a._setPos(o),p=!1),a.clusterHide&&(a.clusterHide(),p=!1),p&&s.removeLayer(a),h&&(l=a._spiderLeg,f=l._path,_=f.getTotalLength()+.1,f.style.strokeDashoffset=_,l.setStyle({opacity:0})));i._ignoreMove=!1,setTimeout(function(){var g=0;for(u=r.length-1;u>=0;u--)a=r[u],a._spiderLeg&&g++;for(u=r.length-1;u>=0;u--)a=r[u],a._spiderLeg&&(a.clusterShow&&a.clusterShow(),a.setZIndexOffset&&a.setZIndexOffset(0),g>1&&s.removeLayer(a),n.removeLayer(a._spiderLeg),delete a._spiderLeg);i._animationEnd(),i.fire("unspiderfied",{cluster:t,markers:r})},200)}}),L.MarkerClusterGroup.include({_spiderfied:null,unspiderfy:function(){this._unspiderfy.apply(this,arguments)},_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Browser.touch||this._map.getRenderer(this)},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._map.off("zoomend",this._noanimationUnspiderfy,this),this._noanimationUnspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(e){this._spiderfied&&this._spiderfied.unspiderfy(e)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(e){e._spiderLeg&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow(),e.setZIndexOffset&&e.setZIndexOffset(0),this._map.removeLayer(e._spiderLeg),delete e._spiderLeg)}}),L.MarkerClusterGroup.include({refreshClusters:function(e){return e?e instanceof L.MarkerClusterGroup?e=e._topClusterLevel.getAllChildMarkers():e instanceof L.LayerGroup?e=e._layers:e instanceof L.MarkerCluster?e=e.getAllChildMarkers():e instanceof L.Marker&&(e=[e]):e=this._topClusterLevel.getAllChildMarkers(),this._flagParentsIconsNeedUpdate(e),this._refreshClustersIcons(),this.options.singleMarkerMode&&this._refreshSingleMarkerModeMarkers(e),this},_flagParentsIconsNeedUpdate:function(e){var t,i;for(t in e)for(i=e[t].__parent;i;)i._iconNeedsUpdate=!0,i=i.__parent},_refreshSingleMarkerModeMarkers:function(e){var t,i;for(t in e)i=e[t],this.hasLayer(i)&&i.setIcon(this._overrideMarkerIcon(i))}}),L.Marker.include({refreshIconOptions:function(e,t){var i=this.options.icon;return L.setOptions(i,e),this.setIcon(i),t&&this.__parent&&this.__parent._group.refreshClusters(this),this}}),d.MarkerClusterGroup=c,d.MarkerCluster=m,Object.defineProperty(d,"__esModule",{value:!0})})});var y={};k(y,T(x(),1));
