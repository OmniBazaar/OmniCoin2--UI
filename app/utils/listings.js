export function getListings(file) {
  const reader = new FileReader();
  const onLoadPromise = new Promise((resolve) => {
    reader.onload = () => {
      resolve(mapListingsFromFile(reader.result));
    };
  });

  reader.readAsText(file);

  return onLoadPromise;
}

const keysMap = {
  'item-name': 'listing_title',
  'item-description': 'description',
  'listing-id': 'listing_uuid',
  'open-date': 'start-date',
  'seller-sku': 'keywords',
  'item-condition': 'codition',
  'image-url': 'imageURL',
};

const valuesMapper = {
  price: Number.parseFloat,
  quantity: Number.parseFloat,
  keywords: keywords => keywords
    .split(keywords, ',')
    .map(keyword => keyword.trim())
};

export function mapListingsFromFile(fileContent = '') {
  const lines = fileContent
    .split(/\n/)
    .filter(line => !!line.trim());
  const header = lines.slice(0, 1)[0].split(/\t/);
  const content = lines.slice(1);

  return content.map((line) => {
    const data = line.split(/\t/);

    return data.reduce((object, val, index) => {
      const key = keysMap[header[index]] || header[index];
      const value = valuesMapper[key] ? valuesMapper[key](val) : val;

      return {
        ...object,
        [key]: value,
      };
    }, {});
  });
}
