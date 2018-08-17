import { handleActions } from 'redux-actions';
import { map, sortBy } from 'lodash';

import {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData,
  updateFileItemSubcategory,
  updateFileItemCategory,
  updateFileItemTitle,
  updateFileItemDescription,
  updateImportConfig,
} from './importActions';

const defaultState = {
  importedFiles: [],
  sortDirection: 'descending',
  sortColumn: 'type',
  importingFile: false,
  stagingFile: false,
  error: null,
  importConfig: {},
  updatingConfig: false,
};

const updateFileItemProp = ({
  prop, value, fileIndex, itemIndex, files,
}) => {
  const importedFiles = [...files];

  importedFiles[fileIndex].items[itemIndex][prop] = value;

  return importedFiles;
};

const reducer = handleActions({
  [stageFile](state) {
    return {
      ...state,
      stagingFile: true,
      error: null,
    };
  },

  [importFiles](state) {
    return {
      ...state,
      importingFile: true,
      error: null,
    };
  },

  [removeFile](state, { payload: { fileIndex } }) {
    return {
      ...state,
      importedFiles: [
        ...state.importedFiles.slice(0, fileIndex),
        ...state.importedFiles.slice(fileIndex + 1)
      ],
    };
  },

  [removeAllFiles](state) {
    return {
      ...state,
      importedFiles: []
    };
  },

  [sortImportData](state, { payload: { sortColumn } }) {
    let sortDirection = state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    const sortedBy = map(state.importedFiles, file => {
      const sortedFile = ({
        ...file,
        items: sortBy(file.items, [sortColumn])
      });

      if (state.sortColumn !== sortColumn) {
        sortedFile.items = sortedFile.items.reverse();
        sortDirection = 'ascending';
      } else {
        sortedFile.items = sortDirection === 'ascending' ? sortedFile.items.reverse() : sortedFile.items;
      }

      return sortedFile;
    });

    return {
      ...state,
      importedFiles: sortedBy,
      sortDirection,
      sortColumn,
    };
  },

  [updateFileItemTitle](state, { payload: { title, index, fileIndex } }) {
    return {
      ...state,
      importedFiles: [...updateFileItemProp({
        fileIndex,
        prop: 'listing_title',
        value: title,
        itemIndex: index,
        files: state.importedFiles,
      })],
    };
  },

  [updateFileItemDescription](state, { payload: { description, index, fileIndex } }) {
    return {
      ...state,
      importedFiles: [...updateFileItemProp({
        fileIndex,
        prop: 'description',
        value: description,
        itemIndex: index,
        files: state.importedFiles,
      })],
    };
  },

  [updateFileItemCategory](state, { payload: { category, index, fileIndex } }) {
    return {
      ...state,
      importedFiles: [...updateFileItemProp({
        fileIndex,
        prop: 'category',
        value: category,
        itemIndex: index,
        files: state.importedFiles,
      })],
    };
  },

  [updateFileItemSubcategory](state, { payload: { subcategory, index, fileIndex } }) {
    return {
      ...state,
      importedFiles: [...updateFileItemProp({
        fileIndex,
        prop: 'subcategory',
        value: subcategory,
        itemIndex: index,
        files: state.importedFiles,
      })],
    };
  },

  [updateImportConfig](state, { payload: { data, provider, remember } }) {
    return {
      ...state,
      updatingConfig: true,
      importConfig: {
        ...state.importConfig,
        [provider]: {
          data,
          remember,
        },
      }
    };
  },

  IMPORT_FILES_SUCCEEDED: (state) => ({
    ...state,
    importedFiles: [],
    importingFile: false,
    error: null,
  }),

  IMPORT_FILES_FAILED: (state, { error }) => ({
    ...state,
    error,
    importingFile: false,
  }),

  STAGING_FILE_SUCCEEDED: (state, { file }) => ({
    ...state,
    importedFiles: [...state.importedFiles, file],
    stagingFile: false,
    error: null,
  }),

  STAGING_FILE_FAILED: (state, { error }) => ({
    ...state,
    error,
    stagingFile: false,
  }),

  IMPORT_CONFIG_UPDATE_SUCCEEDED: (state) => ({
    ...state,
    updatingConfig: false,
    error: null
  }),

  IMPORT_CONFIG_UPDATE_FAILED: (state, { error }) => ({
    ...state,
    error,
    updatingConfig: false,
  }),

  LOAD_IMPORT_CONFIG_SUCCEEDED: (state, { importConfig: { config, provider } }) => {
    const newState = {
      ...state,
      error: null,
      importConfig: {
        ...state.importConfig,
        [provider]: null,
      }
    };

    if (config) {
      const { data, remember } = config;

      return {
        ...newState,
        importConfig: {
          ...state.importConfig,
          [provider]: {
            data,
            remember,
          },
        }
      };
    }

    return newState;
  },

  LOAD_IMPORT_CONFIG_FAILED: (state, { error }) => ({
    ...state,
    error,
  }),
}, defaultState);

export default reducer;
