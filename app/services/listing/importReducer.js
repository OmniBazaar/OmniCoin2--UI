import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData
} from './importActions';

const defaultState = {
  importedFiles: [],
  sortDirection: 'descending',
  sortColumn: 'type',
  importingFile: false,
  stagingFile: false,
  error: null,
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
    const sortBy = _.sortBy(state.importedFiles, [sortColumn]);
    let sortedData = [];

    if (state.sortColumn !== sortColumn) {
      sortedData = sortBy.reverse();
      sortDirection = 'ascending';
    } else {
      sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
    }

    return {
      ...state,
      importedFiles: sortedData,
      sortDirection,
      sortColumn,
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
}, defaultState);

export default reducer;
