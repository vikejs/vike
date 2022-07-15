#!/bin/bash
# Deploy using the Vercel Build Output API.
# https://vercel.com/docs/build-output-api/v3

# 1. Remove existing `.vercel` directory in case it exists.
rm -rf .vercel

# 2. Create a new `.vercel` directory.
mkdir -p .vercel/output

# 3. Copy the `.vercel` directory scaffold.
cp -a vercel/output/. .vercel/output

# 4. Build project on Vercel.
npm run build

# 5. Copy static files to `.vercel` directory.
cp -a dist/client/. .vercel/output/static

# 6. Bundle render function to a single file.
cd .vercel/output/functions/index.func
npx ncc build --minify --out . index.js