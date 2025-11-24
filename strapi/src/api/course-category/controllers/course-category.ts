/**
 * course-category controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::course-category.course-category',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::course-category.course-category')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::course-category.course-category')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
