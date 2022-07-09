Example of deploying a Vite + `vite-plugin-ssr` app to [Vercel](https://vercel.com/).

See [vite-plugin-ssr.com/vercel](https://vite-plugin-ssr.com/vercel).

To run the example:

1. ```bash
    git clone git@github.com:brillout/vite-plugin-ssr
    cd vite-plugin-ssr/examples/vercel/
    ```
2. Create a new Git repository and push it to GitHub/GitLab/...
   ```bash
   git init
   git remote add origin git@github.com:your-username/vite-plugin-ssr_vercel
   git push origin master -u
   ```
3. Create a Vercel account, authorize Vercel to access your newly created Git repository, then finally add your Git repository to Vercel.

To deploy (Vercel's Git integration allows us to simply push to deploy):
- ```bash
  git push
  ```

To develop (for increased dev speed we use Vite's dev server):
- ```bash
  npm install
  npm run dev
  ```
