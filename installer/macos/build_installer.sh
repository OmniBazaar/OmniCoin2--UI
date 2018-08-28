#!/bin/sh

# copy ob2 to app bundle
cp ../../app/ob2/mac/ob2 ../../release/mac/OmniBazaar.app/Contents/MacOS/

# copy node to bundle
cp witness_node.zip ../../release/mac/OmniBazaar.app/Contents/MacOS/

# sign application at first
codesign --deep -s "Developer ID Application: OmniBazaar, Inc. (2LF8AN7Y8M)" ../../release/mac/OmniBazaar.app
codesign -vvv -d ../../release/mac/OmniBazaar.app
spctl -a -vvvvvv --verbose=4 --type execute ../../release/mac/OmniBazaar.app

# make package
pkgbuild --identifier "com.omnibazaar" --root ../../release/mac/OmniBazaar.app --scripts "./scripts/" --install-location /Applications/OmniBazaar.app "OmniBazaar_tmp.pkg"

# sign it
productsign --sign "Developer ID Installer: OmniBazaar, Inc. (2LF8AN7Y8M)" "OmniBazaar_tmp.pkg" "OmniBazaar.pkg"

spctl --assess -v --type install OmniBazaar.pkg

# remove temp file
rm "OmniBazaar_tmp.pkg"
