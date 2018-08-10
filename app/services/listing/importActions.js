import { createActions } from 'redux-actions';

const {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData,
  updateFileItemCategory,
  updateFileItemSubcategory,
  updateFileItemTitle,
  updateFileItemDescription,
} = createActions({
  STAGE_FILE: (file, defaultValues, vendor) => ({ file, defaultValues, vendor }),
  IMPORT_FILES: ({ publisher, filesToImport }) => ({ publisher, filesToImport }),
  REMOVE_FILE: (fileIndex) => ({ fileIndex }),
  REMOVE_ALL_FILES: () => ({}),
  SORT_IMPORT_DATA: (sortColumn) => ({ sortColumn }),
  UPDATE_FILE_ITEM_CATEGORY: ({ category, index, fileIndex }) => ({ category, index, fileIndex }),
  UPDATE_FILE_ITEM_SUBCATEGORY: ({ subcategory, index, fileIndex }) => ({
    subcategory, index, fileIndex
  }),
  UPDATE_FILE_ITEM_TITLE: ({ title, index, fileIndex }) => ({ title, index, fileIndex }),
  UPDATE_FILE_ITEM_DESCRIPTION: ({ description, index, fileIndex }) => ({
    description, index, fileIndex
  }),
});

export {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  sortImportData,
  updateFileItemCategory,
  updateFileItemSubcategory,
  updateFileItemTitle,
  updateFileItemDescription,
};
