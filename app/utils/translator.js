/* eslint-disable */
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './app/**/locales/*.json';
const outputLanguageDataDir = './app/dist/i18n/';


const defaultMessages = globSync(filePattern)
  .map((filename) =>  {
    const file = fs.readFileSync(filename, 'utf8');
    const locale = filename.split('/').pop().split('.')[0];
    return { file, locale };
  })
  .map(({file, locale}) => {
    return {
      obj: JSON.parse(file),
      locale
    }
  })
  .reduce((collection, {locale, obj}) => {
    if (!collection.hasOwnProperty(locale)) {
      collection[locale] = {};
    }
    Object.entries(obj).map(([id, defaultMessage]) => {
      if (collection[locale].hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }
      collection[locale][id] = defaultMessage;
    });

    return collection;
  }, {});

mkdirpSync(outputLanguageDataDir);

fs.writeFileSync(outputLanguageDataDir + 'data.json', `${JSON.stringify(defaultMessages, 2, null)}`);
