# We are deploying using Vercel File System API.
# This is basically just a specific file structure in the "output" folder
# Documentation: https://vercel.com/docs/file-system-api

# Step 1: Cleanup
rm -rf .output

# Step 2: Build the app
yarn build

# Step 3: Create output folder
mkdir .output

# Step 4: Copy static assets
mkdir -p .output/static
cp -a dist/client/. .output/static

# Step 5: Copy render function and rename it to index.js
# If you are using typescript, you should transpile it to javascript
mkdir -p .output/server/pages
cp -a vercel/render.js .output/server/pages/index.js

# Step 6: Make render function run on every request (catch all)
cat > .output/routes-manifest.json << EOF
{
  "version": 3,
  "basePath": "/",
  "pages404": false,
  "dynamicRoutes": [
    {
      "page": "/",
      "regex": "/((?!assets/).*)"
    }
  ]
}
EOF

# Step 7: (Optional) Function configuration
cat > .output/functions-manifest.json << EOF
{
  "version": 1,
  "pages": {
    "index.js": {
      "maxDuration": 10
    }
  }
}
EOF

