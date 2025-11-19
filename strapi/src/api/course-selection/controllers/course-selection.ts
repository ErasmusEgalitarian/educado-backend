/**
 * course-selection controller
 */

// src/api/course-selection/controllers/course-selection.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::course-selection.course-selection',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::course-selection.course-selection')
        .findMany({
          ...ctx.query,
          // here is where you use the populate parameter
          populate: ['exercises', 'lectures', 'course'], // or "*" or object syntax
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::course-selection.course-selection')
        .findOne({
          documentId: id,
          ...ctx.query,
          populate: ['exercises', 'lectures', 'course'],
        });

      return this.transformResponse(result);
    },
  })
);
