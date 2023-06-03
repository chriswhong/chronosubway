export default [
  {
    id: "subway_green",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "4"]],
    paint: {
      "line-color": "rgba(0, 147, 60, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_yellow",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "N"]],
    paint: {
      "line-color": "rgba(252, 204, 10, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_gray",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "L"]],
    paint: {
      "line-color": "rgba(167, 169, 172, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_brown",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "J"]],
    paint: {
      "line-color": "rgba(153, 102, 51, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_light_green",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "G"]],
    paint: {
      "line-color": "rgba(108, 190, 69, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_orange",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "B"]],
    paint: {
      "line-color": "rgba(255, 99, 25, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_blue",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["any", ["==", "rt_symbol", "A"], ["==", "rt_symbol", "SI"]],
    paint: {
      "line-color": "rgba(0, 57, 166, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_purple",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "7"]],
    paint: {
      "line-color": "rgba(185, 51, 173, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_red",
    source: "nyc-subway-routes",
    type: "line",
    filter: ["all", ["==", "rt_symbol", "1"]],
    paint: {
      "line-color": "rgba(238, 53, 46, 1)",
      "line-width": {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  {
    id: "subway_stations",
    minzoom: 7,
    source: "nyc-subway-stops",
    type: "circle",
    paint: {
      "circle-color": "rgba(255, 255, 255, 1)",
      "circle-opacity": {
        stops: [
          [7, 0],
          [10, 1],
        ],
      },
      "circle-stroke-opacity": {
        stops: [
          [7, 0],
          [10, 1],
        ],
      },
      "circle-radius": {
        stops: [
          [7, 1],
          [16, 5],
        ],
      },
      "circle-stroke-width": 2,
      "circle-pitch-scale": "map",
    },
  },
  {
    id: "subway_stations_hover",
    minzoom: 8,
    source: "nyc-subway-stops",
    type: "circle",
    paint: {
      "circle-opacity": 0,
      "circle-radius": {
        stops: [
          [9, 5],
          [13, 25],
        ],
      },
    },
  },
];
