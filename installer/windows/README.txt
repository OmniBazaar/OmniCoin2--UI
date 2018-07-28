1. Set correct version in app\package.json.
run git rev-list --count HEAD and set correct revision number in "version" field.
e.g.  "version": "1.0.5916"

2. Build UI code.
npm install
npm run package

3. Download latest build of witness_node and put it in "\omnibazaar-ui\installer\windows\witness_node", so that directory tree would be:

│   build_installers.bat
│   icon.ico
│   README.txt
│   setup.iss
│
└───witness_node
    │   genesis.json
    │   libcurl.dll
    │   libeay32.dll
    │   README.txt
    │   ssleay32.dll
    │   witness_node.exe
    │   cli_wallet.exe
    │
    └───witness_node_data_dir
            config.ini
            config_log.ini
			
4. Run build_installers.bat script as admin. You must have certificate and password to build installer.
