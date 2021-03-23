import 'ol/ol.css';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {GeoJSON, WFS, GML3, KML, GML} from 'ol/format';
import {Text, Style, Stroke, Fill} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer} from 'ol/layer';
import {fromLonLat, toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';
import {ScaleLine, ZoomToExtent, defaults as defaultControls} from 'ol/control';
import TopoJSON from 'ol/format/TopoJSON';

// Designate Center of Map
const denmarkLonLat = [10.835589, 56.232371];
const denmarkWebMercator = fromLonLat(denmarkLonLat);

// Home Icon for default extent button
var home_icon = document.createElement('span');
home_icon.innerHTML = '<img src="https://image.flaticon.com/icons/png/512/69/69524.png" width="20" height="20">';

// Return to Default Extent Button
var homeExtent = new ZoomToExtent({ // Zoom to Country Extent
  extent: [
    // Uses EPSG 3857 for these coordinates
    836526.837553,
    7249899.258792,
    1726865.343019,
    7959234.881279
  ],
  label: home_icon
});

var style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});

var dk_style = new Style({
  fill: new Fill({
    color: 'rgba(220, 241, 247, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});

// Country/Regions Boundary
var dk_boundary = new VectorLayer({
  source: new VectorSource({
    format: new TopoJSON(),
    url: "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/denmark/denmark-counties.json",
  }),
  style: function(feature) {
    dk_style.getText().setText(feature.get('NAME_1'));
    return dk_style;
  },
  minResolution: 401,
});

// Pull Municipalities Boundaries from GitHub
var municipalities = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "https://raw.githubusercontent.com/Neogeografen/dagi/master/geojson/kommuner.geojson",
  }),
  style: function(feature) {
    style.getText().setText(feature.get('KOMNAVN'));
    return style;
  },
  minResolution: 15,
  maxResolution: 400,
});

// Scaleline
var scaleline = new ScaleLine();

// Define layers to be mapped
var layers = [
  new TileLayer({
    source: new OSM(),
  }),
  municipalities,
  dk_boundary
];

// Define map
var map = new Map({
  controls: defaultControls().extend([homeExtent, scaleline]),
  layers: layers,
  view: new View({
    center: denmarkWebMercator,
    zoom: 7
  }),
  target: 'map'
});

// Popup showing the position the user clicked
var popup = new Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup);

// Click Event for Popup (Work in Progress)
map.on('click', function (evt) {
  var element = popup.getElement();
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  $(element).popover('dispose');
  popup.setPosition(coordinate);
  $(element).popover({
    container: element,
    placement: 'top',
    animation: false,
    html: true,
    content: '<p>(WORK IN PROGRESS) The location you clicked was:</p><code>' + hdms + '</code>',
  });
  $(element).popover('show');
});