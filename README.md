# Educado Backend (+ Web)

This documentation is WIP, and will be improved shortly.

## Running web

1. Fill out the .env file according to the .env.example. and install node packages.
2. Start Strapi
3. (For now) go to the old backend repo and checkout the the dev branch.
4. In educado-backend-old, go to settings/cors.js and change ports to :5174
5. Fill out the .env file in the old repo
6. Start the old backend along with Strapi (npm run dev)
7. Go to /web and write ´npm run dev´

## Running Strapi

Strapi requires node version 22 (LTS / Long-term support) version. It uses Postgres as a relational database, which you can run in Docker.

**Starting Postgres**
To start Postgres, go to the projects root. Note this step is not required, except when running Strapi using the dev server.

Execute:

`docker compose up -d strapiDB`

This will start the postgres container only.

**Running Strapi's dev server**
To develop on the Strapi instance, you can use either the dev server, or docker. If you want to use the dev server, you need to have started Postgress before as mentioned above.

To start the dev server, execute:

```sh
cd strapi
npm run dev
```

**Running Strapi for Mobile or Web development**
If you don't need Strapi's dev server for hot-reload, you can run both Strapi and Postgres with Docker alone.

Go to the project root and execute:

```sh
docker compose up --build -d
```

This will build and run both Strapi and Postgres.

**Stopping the containers**

To stop all running containers, you can execute the following in the project root:

```
docker compose down
```
