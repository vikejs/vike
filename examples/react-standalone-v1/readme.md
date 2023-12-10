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

After build, the `dist` folder will contain everything needed for the production deployment.
```bash
zip --symlinks -r dist.zip dist/
```