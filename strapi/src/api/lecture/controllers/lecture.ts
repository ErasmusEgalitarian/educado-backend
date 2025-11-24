/**
 * lecture controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::lecture.lecture',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::lecture.lecture')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::lecture.lecture')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
