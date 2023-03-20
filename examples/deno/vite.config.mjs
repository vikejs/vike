import react from 'npm:@vitejs/plugin-react@^3.0.0'
import ssr from 'npm:vite-plugin-ssr@^0.4.69/plugin'

import 'npm:react@^18.2.0'
import 'npm:react-dom@^18.2.0/client'

export default {
  plugins: [react(), ssr()]
}
