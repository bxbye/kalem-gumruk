module.exports = {
  apps: [
    {
      name: "kalem-backend",
      cwd: "./backend",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
    {
      name: "kalem-frontend",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        BACKEND_INTERNAL_URL: "http://localhost:5001",
      },
    },
  ],
};
