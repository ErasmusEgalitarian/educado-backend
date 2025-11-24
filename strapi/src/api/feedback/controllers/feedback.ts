/**
 * feedback controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::feedback.feedback',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::feedback.feedback')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::feedback.feedback')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
