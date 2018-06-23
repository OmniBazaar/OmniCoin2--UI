Installer was created with Debreate app.
https://antumdeluge.github.io/debreate-web/

1. Build UI code.
npm install
npm run package

2. Set correct version in app\package.json.
run git rev-list --count HEAD and set correct revision number in "version" field.
e.g.  "version": "1.0.5916"

3. build installer with installer.dbp or installer_full.dbp.
