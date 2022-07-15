See [vite-plugin-ssr.com/vercel](https://vite-plugin-ssr.com/vercel).

How to deploy:
 1. Fork this repository.
 1. Log in to your [Vercel](https://vercel.com/) account (or create one).
 1. Add your fork on Vercel's dashboard and deploy.

That's it, your fork is now deployed on Vercel (it should look like [vite-plugin-ssr-demo.vercel.app](https://vite-plugin-ssr-demo.vercel.app)). It's continuously deployed: if you commit and push a change to your fork, then Vercel automatically re-deploys your app.

Integration points:
 - Serverless Function: [vercel/output/functions/index.func/index.js](vercel/output/functions/index.func/index.js).
 - Rewrite URLs to our Serverless Function: [vercel.json#rewrites](vercel.json).
 - Build on Vercel: [package.json#scripts["vercel-build"]](package.json).
 - Local Development: [package.json#scripts["dev"]](package.json).
