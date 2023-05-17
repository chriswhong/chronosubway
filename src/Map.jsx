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
import simplifiedBoroughBoundaries from "./assets/data/simplified-borough-boundaries.json";

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
      maxZoom: 12.6,
      // bearing: 28.8,
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
      map.addSource("borough-boundaries", {
        type: "geojson",
        data: simplifiedBoroughBoundaries,
      });

      map.addLayer(
        {
          id: "fill-borough-boundaries",
          type: "fill",
          source: "borough-boundaries",
          paint: {
            "fill-color": "#4F4F4F",
          },
        },
        "national-park"
      );

      map.addSource("isochrone", {
        type: "geojson",
        data: dummyFC,
      });

      map.addLayer(
        {
          id: "fill-isochrone-40",
          type: "fill",
          source: "isochrone",
          paint: {
            "fill-color": "#f1eef6",
          },
          filter: ["==", ["get", "duration"], "40"],
        },
        "national-park"
      );

      map.addLayer(
        {
          id: "fill-isochrone-30",
          type: "fill",
          source: "isochrone",
          paint: {
            "fill-color": "#bdc9e1",
          },
          filter: ["==", ["get", "duration"], "30"],
        },
        "national-park"
      );

      map.addLayer(
        {
          id: "fill-isochrone-20",
          type: "fill",
          source: "isochrone",
          paint: {
            "fill-color": "#74a9cf",
          },
          filter: ["==", ["get", "duration"], "20"],
        },
        "national-park"
      );

      map.addLayer(
        {
          id: "fill-isochrone-10",
          type: "fill",
          source: "isochrone",
          paint: {
            "fill-color": "#0570b0",
          },
          filter: ["==", ["get", "duration"], "10"],
        },
        "national-park"
      );

      map.addLayer(
        {
          id: "line-isochrone-40",
          type: "line",
          source: "isochrone",
          paint: {
            "line-color": "#aaa",
          },
        },
        "national-park"
      );

      map.addSource("nyc-subway-stops", {
        type: "geojson",
        data: stopsData,
      });

      map.on("mousemove", "subway_stations_hover", (e) => {
        const { features } = e;
        if (features) {
          map.getCanvas().style.cursor = "pointer";
          const { stopId } = features[0].properties;
          const { geometry } = features[0];

          if (stopId !== activeStopId) {
            setActiveStopId(stopId);
            map.getSource("active-stop").setData(geometry);
          }
        } else {
          map.getCanvas().style.cursor = "default";
          setActiveStopId(null);
        }
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

      map.addSource("active-stop", {
        type: "geojson",
        data: dummyFC,
      });

      const width = 25;
      const height = 25;

      const img = new Image(width, height);
      // map is your Mapbox GL map object
      img.onload = () => map.addImage("star", img);
      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3C!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z' fill='yellow' /%3E%3C/svg%3E`;

      map.addLayer(
        {
          id: "active-stop-fill",
          type: "symbol",
          source: "active-stop",
          layout: {
            "icon-image": "star",
            "icon-allow-overlap": true,
          },
          paint: {
            "icon-color": "yellow",
          },
        },
        "subway_stations"
      );

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

      <div className="absolute top-5 left-5 z5 text-white w-2/6 bg-gray-700 p-4 rounded-md">
        <div className="">
          <div className="font-bold text-3xl mb-3">Subway Isochrones</div>
          <div className=" text-sm mb-2">
            Transit access is more than proximity to a station, the frequency
            and connections also play a role.
          </div>

          <div className=" text-sm mb-3">
            This map lets you explore how much of the city is accessible from
            each subway station.
          </div>

          {!station && (
            <div className=" text-sm mb-2 outline-dotted rounded-md border my-3 p-3">
              Hover over a station to see how much of the city is accessible
              within 40 minutes by subway and walking.
            </div>
          )}
          {station && <StationHeader station={station} />}
        </div>{" "}
      </div>
    </>
  );
}

export default Map;
