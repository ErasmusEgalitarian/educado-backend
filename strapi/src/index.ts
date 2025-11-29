import type { Core } from '@strapi/strapi';
import { mergeSwaggerDocumentation } from "./extensions/documentation/merge-openapi";
import { runDataSeeders } from "./bootstrap";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {

  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Merge custom API documentation with auto-generated Strapi API documentation for CRUD
    mergeSwaggerDocumentation();

    // Run data seeders if SEED_DATA=true
    await runDataSeeders(strapi);
  },
};
