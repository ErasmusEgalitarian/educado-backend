/**
 * course-selection controller
 */

// src/api/course-selection/controllers/course-selection.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::course-selection.course-selection',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::course-selection.course-selection')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::course-selection.course-selection')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
