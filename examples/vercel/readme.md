Example of deploying a Vite + `vite-plugin-ssr` app to [Vercel](https://vercel.com/).

To run it:
1. ```bash
    git clone git@github.com:brillout/vite-plugin-ssr
    cd vite-plugin-ssr/examples/vercel/
    ```
2. Create a new Git repository and push it to GitHub/GitLab/...
   ```bash
   git init
   git remote add origin git@github.com:your-username/vercel-vite-plugin-ssr
   git push origin master -u
   ```
3. Create a Vercel account and authorize Vercel to access your newly created Git repository.

To develop (for increased dev speed we use an Express.js dev server instead of `vercel dev`):
- ```bash
  npm install
  npm run dev
  ```

To deploy (Vercel's Git integration allows us to simply push to deploy):
- ```bash
  git push
  ```
