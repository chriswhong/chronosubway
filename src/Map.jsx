import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import accessToken from "./access-token";

import stopsData from "./assets/data/stops.json";
import routesData from "./assets/data/subway-routes.json";
import subwayLayerStyles from "./subway-layer-styles";
import StationHeader from "./StationHeader";

import stations from "./assets/data/stations.json";

mapboxgl.accessToken = accessToken;

const dummyFC = {
  type: "FeatureCollection",
  features: [],
};

function Map() {
  const mapContainer = useRef(null);
  const geocoderRef = useRef(null);
  const [activeStopId, setActiveStopId] = useState();
  const [mapLoaded, setMapLoaded] = useState(false);

  let mapRef = useRef(null);

  if (!mapRef) {
    mapRef = useRef(null);
  }

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      bounds: [-74.28423, 40.48451, -73.73228, 40.91912],
      accessToken,
      hash: true,
    });

    const map = mapRef.current;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
    });
    map.addControl(geocoder);

    if (geocoderRef) {
      geocoderRef.current = geocoder;
    }

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      map.addSource("isochrone", {
        type: "geojson",
        data: dummyFC,
      });

      map.addLayer({
        id: "fill-isochrone-40",
        type: "fill",
        source: "isochrone",
        paint: {
          "fill-color": "#f1eef6",
        },
        filter: ["==", ["get", "duration"], "40"],
      });

      map.addLayer({
        id: "fill-isochrone-30",
        type: "fill",
        source: "isochrone",
        paint: {
          "fill-color": "#bdc9e1",
        },
        filter: ["==", ["get", "duration"], "30"],
      });

      map.addLayer({
        id: "fill-isochrone-20",
        type: "fill",
        source: "isochrone",
        paint: {
          "fill-color": "#74a9cf",
        },
        filter: ["==", ["get", "duration"], "20"],
      });

      map.addLayer({
        id: "fill-isochrone-10",
        type: "fill",
        source: "isochrone",
        paint: {
          "fill-color": "#0570b0",
        },
        filter: ["==", ["get", "duration"], "10"],
      });

      map.addLayer({
        id: "line-isochrone-40",
        type: "line",
        source: "isochrone",
        paint: {
          "line-color": "#aaa",
        },
      });

      map.addSource("nyc-subway-stops", {
        type: "geojson",
        data: stopsData,
      });

      map.on("mouseenter", "subway_stations", (e) => {
        const { features } = e;
        const { stopId } = features[0].properties;
        if (stopId !== activeStopId) {
          setActiveStopId(stopId);
        }
      });

      map.on("mouseleave", "subway_stations", () => {
        setActiveStopId(null);
      });

      // add geojson sources for subway routes and stops
      map.addSource("nyc-subway-routes", {
        type: "geojson",
        data: routesData,
      });

      // add layers by iterating over the styles in the array defined in subway-layer-styles.js
      subwayLayerStyles.forEach((style) => {
        map.addLayer(style);
      });

      setMapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;

    if (activeStopId) {
      const isochronePath = `isochrones/${activeStopId}.geojson`;
      mapRef.current.getSource("isochrone").setData(isochronePath);
    } else {
      mapRef.current.getSource("isochrone").setData(dummyFC);
    }
  }, [activeStopId]);

  const getStation = (stopId) => stations.find((d) => d.stopId === stopId);

  const station = getStation(activeStopId);

  return (
    <>
      <div ref={mapContainer} className="map-container h-full" />
      {station && (
        <div className="absolute top-5 left-5 z5 text-white">
          <StationHeader station={station} />
        </div>
      )}
    </>
  );
}

export default Map;
