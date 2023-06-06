// packages
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import classNames from "class-names";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLockOpen,
  faLock,
  faTrainSubway,
} from "@fortawesome/free-solid-svg-icons";

// local components and js files
import accessToken from "./access-token";
import subwayLayerStyles from "./subway-layer-styles";
import StationHeader from "./StationHeader";
import { slugify, stopFromSlugifiedId } from "./util";
import Modal from "./Modal";

// css
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// data
import stations from "./assets/data/stations.json";
import stopsData from "./assets/data/stops.json";
import routesData from "./assets/data/subway-routes.json";
import simplifiedBoroughBoundaries from "./assets/data/simplified-borough-boundaries.json";
import subwayIsochronesLegend from "./assets/subway-isochrones-legend.svg";

mapboxgl.accessToken = accessToken;

const dummyFC = {
  type: "FeatureCollection",
  features: [],
};

function Map() {
  let mapRef = useRef(null);
  const location = useLocation();

  const mapContainer = useRef(null);
  const geocoderRef = useRef(null);
  const locationRef = useRef(null);

  if (!mapRef) {
    mapRef = useRef(null);
  }

  const [showModal, setShowModal] = useState(false);

  const [activeStopId, setActiveStopId] = useState();
  const [highlightedStopId, setHighlightedStopId] = useState();

  const [mapLoaded, setMapLoaded] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  // if not on a stop route show isochrone on hover
  const isStopRoute = location.pathname.includes("stop");

  // takes a stop as a geojson Feature, sets activeStopId and updates the source for highlighting the active stop
  const setActiveStop = (stop) => {
    if (stop) {
      setActiveStopId(stop.properties.stopId);
      mapRef.current.getSource("active-stop").setData(stop);
    }
  };

  const highlightStop = (stop) => {
    setHighlightedStopId(stop.properties.stopId);
    mapRef.current.getSource("highlighted-stop").setData(stop);
  };

  // update active stop when the url changes
  useEffect(() => {
    locationRef.current = location;
    if (!mapRef.current) return;
    if (location.pathname !== "/") {
      if (stopFromSlugifiedId(params.id) !== activeStopId) {
        const stop = stopFromSlugifiedId(params.id);
        setActiveStop(stop);
      }
    }
  }, [location]);

  const handleMouseMove = (e) => {
    const map = mapRef.current;

    const features = map.queryRenderedFeatures(e.point, {
      layers: ["subway_stations_hover"],
    });

    // if we are on a stop route, don't show other isochrones on hover,
    // just highlight the other stop to show it is clickable

    const stopRoute = locationRef.current.pathname.includes("stop");
    if (features.length) {
      map.getCanvas().style.cursor = "pointer";
      const { stopId } = features[0].properties;
      if (!stopRoute) {
        // show highlight star and isochrone
        if (stopId !== activeStopId) {
          setActiveStop(features[0]);
        }
      } else {
        // just highlight the stop
        highlightStop(features[0]);
      }
    } else {
      map.getCanvas().style.cursor = "default";
      if (!isStopRoute) {
        setActiveStop(null);
      }
    }
  };

  // on mount, instantiate the map and add sources and layers
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      bounds: [-74.28423, 40.48451, -73.73228, 40.91912],
      accessToken,
      hash: true,
      minZoom: 9.5,
      maxZoom: 14,
      maxBounds: [
        [-74.28149, 40.42747],
        [-73.5877, 40.98703],
      ],
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
        "building"
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
        "building"
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
        "building"
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
        "building"
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
        "building"
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
        "building"
      );

      map.addSource("nyc-subway-stops", {
        type: "geojson",
        data: stopsData,
        promoteId: "stopId",
      });

      map.on("mousemove", handleMouseMove);

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

      map.addSource("highlighted-stop", {
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

      const labelStyle = {
        minzoom: 10,
        type: "symbol",
        layout: {
          "text-field": ["get", "stop_name"],
          "symbol-placement": "point",
          "symbol-spacing": 250,
          "symbol-avoid-edges": false,
          "text-size": 14,
          "text-anchor": "left",
          "text-letter-spacing": 0.05,
        },
        paint: {
          "text-halo-color": "#000",
          "text-color": "#FFF",
          "text-halo-width": 2,
          "text-translate": [15, 11],
          "text-opacity": {
            stops: [
              [7, 0],
              [8, 1],
            ],
          },
        },
      };

      map.addLayer({
        id: "active-stop-label",
        source: "active-stop",
        ...labelStyle,
      });

      map.addLayer({
        id: "stop-labels-small",
        source: "nyc-subway-stops",
        ...labelStyle,
        layout: {
          ...labelStyle.layout,
          "text-size": 12,
        },
        paint: {
          ...labelStyle.paint,
          "text-translate": [10, 8],
        },
      });

      map.addLayer({
        id: "highlighted-stop-label",
        source: "highlighted-stop",
        ...labelStyle,
        layout: {
          ...labelStyle.layout,
        },
      });

      map.addLayer(
        {
          id: "highlighted-stop-fill",
          type: "symbol",
          source: "highlighted-stop",
          layout: {
            "icon-image": "star",
            "icon-allow-overlap": true,
            "icon-size": 0.8,
          },
          paint: {
            "icon-color": "yellow",
            "icon-opacity": 0.6,
          },
        },
        "subway_stations"
      );

      map.on("click", "subway_stations_hover", (e) => {
        const { stopId, stop_name } = e.features[0].properties;

        navigate(`/stop/${slugify(stopId)}/${slugify(stop_name)}`);
      });

      setMapLoaded(true);

      if (params.id) {
        const stop = stopFromSlugifiedId(params.id);
        setActiveStop(stop);
      }
    });
  }, []);

  // when activeStopId changes, fetch isochrone data and update the isochrone source
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;
    if (activeStopId) {
      const isochronePath = `/isochrones/${activeStopId}.geojson`;
      map.getSource("isochrone").setData(isochronePath);
    } else {
      map.getSource("isochrone").setData(dummyFC);
    }
  }, [activeStopId]);

  // stations is different from stops, and is used to render the StationHeader component
  const getStation = (stopId) =>
    stations.find((d) => {
      if (Array.isArray(d.stopId)) {
        return d.stopId.includes(stopId);
      }
      return d.stopId === stopId;
    });
  const station = getStation(activeStopId);

  return (
    <>
      <div ref={mapContainer} className="map-container h-full" />

      <div className="absolute top-2 sm:top-2 left-2 right-2 sm:left-2 sm:right-auto z5 text-white sm:w-96 bg-gray-700 p-3 rounded-md">
        <div className="">
          <div className="font-extrabold leading-none tracking-tight text-xl md:text-3xl mb-3 text-emerald-500">
            <FontAwesomeIcon icon={faTrainSubway} className="mr-2" /> NYC
            Subwaysheds
          </div>
          <div className="text-sm mb-2">
            How far can you get in 40 minutes from each subway station in New
            York City?
          </div>

          {!station && (
            <div
              className=" text-sm mb-2 outline-dotted rounded-md border my-3 p-3"
              style={{ height: 95 }}
            >
              Hover over a station to see how much of the city is accessible
              within 40 minutes by subway and walking.
            </div>
          )}
          {station && <StationHeader station={station} />}
        </div>{" "}
        <div className="mt-3 flex items-center">
          <button
            type="button"
            className="font-semibold text-emerald-500 hover:text-emerald-600 cursor-pointer hover:underline text-sm"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon className="mr-1" icon={faCircleInfo} />
            About
          </button>
          <div className="flex-grow flex justify-end">
            <button
              onClick={() => {
                navigate("/");
              }}
              type="button"
              className={classNames(
                "text-white  font-medium rounded-full text-sm px-3 py-1 text-center",
                {
                  "bg-red-700 hover:bg-red-800": isStopRoute,
                  "bg-transparent hover:bg-transparent": !isStopRoute,
                }
              )}
            >
              {isStopRoute && <>Unlock station hover</>}
              {!isStopRoute && <>Click a station to lock</>}
              <FontAwesomeIcon
                className="ml-2"
                icon={isStopRoute ? faLock : faLockOpen}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-9 left-2 z5 text-white w-2/6 bg-gray-700 p-3 rounded-md w-48">
        <div className="text-sm md:text-md font-bold mb-2 text-emerald-500">
          Accessible Area
        </div>
        <img
          src={subwayIsochronesLegend}
          alt="legend explaining isochrone travel times"
        />
      </div>
      <Modal show={showModal} setShow={setShowModal} />
    </>
  );
}

export default Map;
