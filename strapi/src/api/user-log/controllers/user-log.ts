/**
 * user-log controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::user-log.user-log',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::user-log.user-log')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
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
