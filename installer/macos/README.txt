1. Build UI code.
npm install
npm run package

2. Set correct version in app\package.json.
run git rev-list --count HEAD and set correct revision number in "version" field.
e.g.  "version": "1.0.5916"

3. Download latest build of witness_node and put it in "\omnibazaar-ui\installer\macos\witness_node", so that directory tree would be:

│   build_installer_full.sh
|   build_installer.sh
│   scripts
│   README.txt
│   scripts_full
│
└───witness_node
    │   genesis.json
    │   README.txt
    │   witness_node
    │   cli_wallet
    │
    └───witness_node_data_dir
            config.ini
            config_log.ini

4. Compress witness_node directory to witness_node.zip archive.
			
5. Run “sh build_installer.sh” or “sh build_installer_full.sh” script.