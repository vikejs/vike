Example of using Vike standalone build with various native libraries and [Telefunc](https://telefunc.com).

To run it:

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/react-standalone-v1/
npm install
npm run dev
```

To build it:

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/react-standalone-v1/
npm install
npm run build
```

After build, the `dist` folder will contain everything needed for the production deployment.<br>
The `dist/server/node_modules` folder may contain symlinks if your package manager makes use of symlinks.<br>
If `dist/server/node_modules` contains symlinks, they need to be preserved when copying for deployment:<br>
Linux:
```bash
Local:
zip --symlinks -r dist.zip dist/

Remote:
unzip dist.zip
```

Windows:
```bash
Local:
tar -cvzf dist.tar.gz dist/

Remote:
tar -xvzf dist.tar.gz
```