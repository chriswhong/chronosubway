import turfPoint from "turf-point";
import turfNearestPoint from "@turf/nearest-point";

import stops from "./stops.json" assert { type: "json" };
import stations from "./stations.js";

const noMatches = [];

const stationsWithIds = stations.map((station) => {
  console.log(station.name);

  const nearest = turfNearestPoint(turfPoint(station.coordinates[0]), stops);
  console.log(nearest);

  station.stopId = nearest.properties.stop_id;

  return station;
});

console.log(JSON.stringify(stationsWithIds));
