/**
 * course controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::course.course',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::course.course')
        .findMany({
          ...ctx.query,
          // Populate course relations
          populate: ['feedbacks', 'course_sections', 'course_categories', 'students', 'content_creators'],
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
          populate: ['feedbacks', 'course_sections', 'course_categories', 'students', 'content_creators'],
        });

      return this.transformResponse(result);
    },
  })
);
