import {hash} from "omnibazaarjs";

export const getListingHash = (listing) => {
  const fields = [
    "address",
    "category",
    "city",
    "condition",
    "condition_info",
    "condition_type",
    "continuous",
    "country",
    "currency",
    "description",
    "end_date",
    "images",
    "keywords",
    "listing_title",
    "name",
    "post_code",
    "price",
    "price_using_btc",
    "price_using_omnicoin",
    "quantity",
    "start_date",
    "state",
    "subcategory",
    "units"
  ];

  const forHash = {...listing};
  Object.keys(forHash).forEach(key => {
    if (!fields.includes(key)) {
      delete forHash[key];
    }
  });
  const ordered = {};
  Object.keys(forHash).sort().forEach(function(key) {
    if (key === 'images') {
      ordered.images = forHash.images.map(image => image.image_name).sort();
    } else if (key === 'keywords') {
      ordered.keywords = forHash.keywords.sort();
    }
    else {
      ordered[key] = forHash[key];
    }
  });
  return hash.sha256(JSON.stringify(ordered), 'hex');
};
