module.exports = {
  apps : [
      {
        name: "Tdarr",
        script: "./main.js",
        watch: true,
        detached: true,
        env: {

            "NODE_ENV": "production",
            "PORT": 8265,
            "MONGO_URL": "mongodb://localhost:27017/Tdarr",
            "ROOT_URL":"http://localhost/",
            "NODE_ENV": "production",

        }
      }
  ]
}