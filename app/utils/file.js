const getFileExtension = ({ name }) => {
  const idxDot = name.lastIndexOf('.') + 1;
  return name.substr(idxDot, name.length).toLowerCase();
};

export { getFileExtension };
