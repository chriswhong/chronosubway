This began as an attempt to mimic the amazing interactive experience of [chronotrains.com](https://chronotrains.com) for the New York City Subway. (I hereby declare the showing of isochrones on hover "the chronotrains effect")

Isochrones are a compelling visual to show the potential reach of a traveler. My goal is to stimulate a conversation about transit access and maybe give NYC straphangers some ideas for new places to explore via a subway trip.

## Isochrone Info & Caveats

* Travel times are based on the [NYC Transit GTFS file](http://web.mta.info/developers/developer-data-terms.html#data), processed by the [`gtfsrouter` R package](https://cran.r-project.org/web/packages/gtfsrouter/index.html) assuming a weekday trip starting at noon.
* Isochrones are manually calculated using [turf.js](https://turfjs.org/) assuming 1.2m/s walking speed after the subway trip. These are simple buffers around each station/prior isochrone and do not take the street network into account. 
* Full code for the isochrone workflow is available on [github](https://github.com/chriswhong/nyc-subway-isochrones).


## Attribution & Thanks

* Subway station sign code and dataset from [nycguessr.com](https://nycguessr.com) ([github](https://github.com/BenMusch/nycguessr))
* Special thanks to Sunny Ng for testing and feedback and Benjamin Tran Dinh for making chronotrains in the first place.

## Contact

Reach out to me on twitter at [@chris_whong](https://twitter.com/chris_whong) with feedback and suggestions!

