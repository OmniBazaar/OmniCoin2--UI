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
};

const reducer = handleActions({
  [importFile](state, { payload: { file } }) {
    return {
      ...state,
      importedFiles: [...state.importedFiles, file]
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
}, defaultState);

export default reducer;
