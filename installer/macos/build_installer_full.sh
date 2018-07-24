#!/bin/sh

# copy ob2 to app bundle
cp ../../app/ob2/mac/ob2 ../../release/mac/OmniBazaar.app/Contents/MacOS/

# copy node to bundle
cp witness_node.zip ../../release/mac/OmniBazaar.app/Contents/MacOS/

# make package
pkgbuild --identifier "com.omnibazaar" --root ../../release/mac/OmniBazaar.app --scripts "./scripts_full/" --install-location /Applications/OmniBazaar.app "OmniBazaar.pkg"
