import slugifyBase from "slugify";
import stopsData from "./assets/data/stops.json";

const slugify = (d) =>
  slugifyBase(d, {
    lower: true,
  });

const stopFromSlugifiedId = (id) =>
  stopsData.features.find((d) => slugify(d.properties.stopId) === id);

export { slugify, stopFromSlugifiedId };
