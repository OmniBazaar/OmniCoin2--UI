const getFileExtension = (event) => {
  const fileName = event.target.files[0].name;
  const idxDot = fileName.lastIndexOf('.') + 1;
  return fileName.substr(idxDot, fileName.length).toLowerCase();
};

export { getFileExtension };
