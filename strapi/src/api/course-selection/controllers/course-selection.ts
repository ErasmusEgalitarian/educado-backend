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

    async create(ctx) {
      const { data } = ctx.request.body;

      // Extract the course relation if provided
      const courseDocumentId = data?.course;

      // Create the course section
      const result = await strapi.documents('api::course-selection.course-selection').create({
        data: {
          title: data?.title,
          description: data?.description,
        },
      });

      // If a course was specified, connect it
      if (courseDocumentId && result.documentId) {
        // Find the course's internal ID from its documentId
        const course = await strapi.documents('api::course.course').findFirst({
          filters: { documentId: courseDocumentId },
        });

        if (course) {
          // Use entity service or db query to set the relation
          await strapi.db.query('api::course-selection.course-selection').update({
            where: { documentId: result.documentId },
            data: {
              course: course.id,
            },
          });
        }

        // Re-fetch with the relation
        const updated = await strapi.documents('api::course-selection.course-selection').findOne({
          documentId: result.documentId,
          populate: ['course'],
        });

        return this.transformResponse(updated);
      }

      return this.transformResponse(result);
    },
  })
);
