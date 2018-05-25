import { camelCase } from 'lodash';

export default {
  mapListingsFromFile(fileContent = '') {
    const lines = fileContent
      .split(/\n/)
      .filter(line => !!line.trim());

    const header = lines.slice(0, 1)[0].split(/\t/);
    const content = lines.slice(1);

    return content.map((line) => {
      const data = line.split(/\t/);

      return data.reduce((object, value, index) => ({
        ...object,
        [camelCase(header[index])]: value,
      }), {});
    });
  }
};
