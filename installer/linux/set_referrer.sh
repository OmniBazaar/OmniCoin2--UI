#!/bin/sh
set -e

if [ $# -ge 3 ]; then

  # Get input parameters.
  REFERRER_NAME=$1
  DEB_FILE_PATH=$2
  OUTPUT_DEB_PATH=$3
  TMP_FOLDER="$(basename ${DEB_FILE_PATH})_tmp"

  if [ -d ${TMP_FOLDER} ]; then
    echo "Temporary folder exists, removing ${TMP_FOLDER}"
    rm -rf ${TMP_FOLDER}
  fi

  # Step into temporary folder.
  mkdir ${TMP_FOLDER}
  cd ${TMP_FOLDER}

  # Extract control archive from installer to current folder.
  echo "Extracting control file from package"
  ar xov ${DEB_FILE_PATH} control.tar.xz

  # Create a temporary folder for control files.
  mkdir tmp
  cd tmp

  # Extract control file contents because tar can't update file within compressed archive.
  echo "Extracting control file contents"
  tar -xpf ../control.tar.xz

  # Add referrer name to postinst script.
  echo "Appending referrer"
  # "echo" behavior is inconsistent between versions, so use "printf" to correctly process the newline character.
  printf "\nset_referrer ${REFERRER_NAME}" >> "./postinst"

  # Create new control package.
  echo "Packaging control file"
  tar -cJpf ../control.tar.xz ./

  # Copy original installer to new file, which will get new control file.
  cp ${DEB_FILE_PATH} ${OUTPUT_DEB_PATH}

  # Replace control file in installer.
  echo "Updating control file in output package"
  ar rv ${OUTPUT_DEB_PATH} ../control.tar.xz

  echo "Removing temporary folders"
  cd ../../
  rm -rf ${TMP_FOLDER}

else

  echo "invalid arguments: $@"
  exit 1

fi
