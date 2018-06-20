1. Build UI code.
2. Download latest build of witness_node and put it in "\omnibazaar-ui\installer\windows\witness_node", so that directory tree would be:

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
    │
    └───witness_node_data_dir
            config.ini
            config_log.ini
			
3. Add path to your Inno Setup installation to PATH environment variable.
4. Run ".\build_installers.bat" script.