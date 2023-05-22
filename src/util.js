import slugifyBase from "slugify";

const slugify = (d) =>
  slugifyBase(d, {
    lower: true,
  });

export { slugify };
