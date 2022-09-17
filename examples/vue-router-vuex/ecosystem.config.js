module.exports = {
  apps : [{
    name   : "obsr",
    script : "./server/server.js",
    watch: true,
    // watch_delay: 1000,
    ignore_watch : ["node_modules","dev"],
    max_restarts: 5,
    autorestart: false,
    env: {
      NODE_ENV: "development",
      PORT: 3333,
      OBHOST: "pc"
    },
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
}
