Installer was created with Debreate app.
https://antumdeluge.github.io/debreate-web/

1. Set correct version in app\package.json.
run "git rev-list --count HEAD" and set correct revision number in "version" field.
e.g.  "version": "1.0.5916"

2. Build UI code.
npm install
npm run package

3. Update app version in "installer.dbp" and "installer_full.dbp" files.

4. Build light installer with "installer.dbp".

5. Get latest build of witness_node and unpack it in this folder in "witness_node" subfolder, so that final folder structure is like this:
+---linux
|   |   icon.ico
|   |   installer.dbp
|   |   installer_full.dbp
|   |   README.txt
|   |
|   +---service
|   |       witness-node.service
|   |
|   \---witness_node
|       |   cli_wallet
|       |   genesis.json
|       |   README.txt
|       |   witness_node
|       |
|       \---witness_node_data_dir
|               config.ini
|               config_log.ini

6. Build full installer with "installer_full.dbp".
