import { createActions } from 'redux-actions';

const {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData
} = createActions({
  STAGE_FILE: (file, defaultValues) => ({ file, defaultValues }),
  IMPORT_FILES: ({ publisher, filesToImport }) => ({ publisher, filesToImport }),
  REMOVE_FILE: (fileIndex) => ({ fileIndex }),
  REMOVE_ALL_FILES: () => ({}),
  SORT_IMPORT_DATA: (sortColumn) => ({ sortColumn }),
});

export {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData
};
