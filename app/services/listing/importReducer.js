import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  importFile,
  removeFile,
  removeAllFiles,
  sortImportData
} from './importActions';

const defaultState = {
  importedFiles: [],
  sortDirection: 'descending',
  sortColumn: 'type',
  importingFile: false,
  error: null,
};

const reducer = handleActions({
  [importFile](state) {
    return {
      ...state,
      importigFile: true,
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

  IMPORT_FILE_SUCCEEDED: (state, { file }) => ({
    ...state,
    importedFiles: [...state.importedFiles, file],
    importingFile: false,
    error: null,
  }),

  IMPORT_FILE_FAILED: (state, { error }) => ({
    ...state,
    error,
    importingFile: false,
  }),
}, defaultState);

export default reducer;
