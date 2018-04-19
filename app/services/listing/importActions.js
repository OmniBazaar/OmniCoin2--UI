import { createActions } from 'redux-actions';

const {
  importFile,
  removeFile,
  removeAllFiles,
  sortImportData
} = createActions({
  IMPORT_FILE: (file) => ({ file }),
  REMOVE_FILE: (fileIndex) => ({ fileIndex }),
  REMOVE_ALL_FILES: () => ({}),
  SORT_IMPORT_DATA: (sortColumn) => ({ sortColumn }),
});

export {
  importFile,
  removeFile,
  removeAllFiles,
  sortImportData
};
