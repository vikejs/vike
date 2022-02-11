import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      routes: {
        $default: new sst.Function(this, "TestFunc", {
          handler: "src/lambda.handler",
          bundle: {
            copyFiles: [
              { from: "dist/server", to: "./src" },
              { from: "dist/server", to: "./dist/server" },
            ],
            // commandHooks: {
            //   beforeInstall() {
            //     return [];
            //   },
            //   beforeBundling(inputDir, outputDir) {
            //     console.log("before:", inputDir, outputDir);
            //     return [
            //       `./node_modules/.bin/vite build --outDir ${outputDir} && ` +
            //         `./node_modules/.bin/vite build --ssr --outDir ${outputDir}`,
            //     ];
            //   },
            //   afterBundling(inputDir, outputDir) {
            //     console.log("after:", inputDir, outputDir);
            //     return ["echo after"];
            //   },
            // },
          },
        }),
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
