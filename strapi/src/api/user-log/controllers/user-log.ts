/**
 * user-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::user-log.user-log',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::user-log.user-log')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::user-log.user-log')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
