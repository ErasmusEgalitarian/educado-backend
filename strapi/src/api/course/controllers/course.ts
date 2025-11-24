/**
 * course controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::course.course',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::course.course')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::course.course')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
