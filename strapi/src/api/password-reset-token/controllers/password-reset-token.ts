/**
 * password-reset-token controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::password-reset-token.password-reset-token',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::password-reset-token.password-reset-token')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::password-reset-token.password-reset-token')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
