#!/bin/sh
set -e

if [ $# -ge 3 ]; then

  REFERRER_NAME=$1
  DEB_FILE_PATH=$2
  OUTPUT_DEB_PATH=$3
  TMP_FOLDER="$(basename ${DEB_FILE_PATH})_tmp"

  if [ -d ${TMP_FOLDER} ]; then
    echo "Temporary folder exists, removing ${TMP_FOLDER}"
    rm -rf ${TMP_FOLDER}
  fi
  echo "Extracting package to ${TMP_FOLDER}"
  dpkg-deb --raw-extract ${DEB_FILE_PATH} ${TMP_FOLDER}
  echo "Appending referrer"
  echo "\nset_referrer ${REFERRER_NAME}" >> "${TMP_FOLDER}/DEBIAN/postinst"
  echo "Packaging ${TMP_FOLDER} to ${OUTPUT_DEB_PATH}"
  dpkg-deb --build ${TMP_FOLDER} ${OUTPUT_DEB_PATH}
  echo "Removing temporary folder ${TMP_FOLDER}"
  rm -rf ${TMP_FOLDER}

else

  echo "invalid arguments: $@"
  exit 1

fi
