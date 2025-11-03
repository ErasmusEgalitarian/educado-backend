# Educado Technical Documentation

Welcome to the Educado Technical documentation. This documentation is intended to contain all the technical aspects of the Educado App as a whole.

It consists of:

- The '*Monorepo*'
    - Everything server-side (Strapi, Postgres, Web server)
      - [Strapi CMS](https://strapi.io/) for content management and API
      - Postgres as the main relational database
      - *coming(soon)* Nginx as a web server and possibly reverse proxy?
    - Everything web:
        - (Content Creator platform & Admin interface)
        - React Typescript with Vite
    - Single [**repository:** educado-backend](https://github.com/ErasmusEgalitarian/educado-backend)
- The *Mobile* app
    - End-user facing
    - React Native with Expo
    - Separate [**repository:** educado-mobile](https://github.com/ErasmusEgalitarian/educado-mobile)
