# subwaysheds

An interactive map for exploring transit accessibility in New York City, based on the style of [https://chronotrains.com](https://chronotrains.com)

View it live at [https://subwaysheds.com](https://subwaysheds.com)

<img width="981" alt="card_image" src="https://github.com/chriswhong/chronosubway/assets/1833820/0161b987-ffbd-4913-881b-a7b51c0cb3b5">

## About

This began as an attempt to mimic the amazing interactive experience of chronotrains.com for the New York City Subway. (I hereby declare the showing of isochrones on hover "the chronotrains effect")

Isochrones are a compelling visual to show the potential reach of a traveler. My goal is to stimulate a conversation about transit access and maybe give NYC straphangers some ideas for new places to explore via a subway trip.

## Local Development

- Clone this repository
- Install dependencies `npm install`
- Run the development server `npm run dev`

## Technology

Isochrones were generated from GTFS data using node.js, turf.js, and the `gtfsrouter` R package.  [Isochrone Code](https://github.com/chriswhong/nyc-subway-isochrones)

The app:
- Vite.js with React for the application framework and routing
- Mapbox GL JS for mapping + mapbox-gl-geocoder for search
- Fontawesome for icons
- TailwindCSS for layout and styling


