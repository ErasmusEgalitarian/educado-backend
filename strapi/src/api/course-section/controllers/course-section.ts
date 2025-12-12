/**
 * course-section controller
 */

// src/api/course-section/controllers/course-section.ts
import { factories } from '@strapi/strapi';
import { errorCodes } from "../../../helpers/errorCodes";


export default factories.createCoreController(
  'api::course-section.course-section',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::course-section.course-section')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::course-section.course-section')
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
      try {
        const result = await strapi.documents('api::course-section.course-section').create({
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
            await strapi.db.query('api::course-section.course-section').update({
              where: { documentId: result.documentId },
              data: {
                course: course.id,
              },
            });
          }
  
          // Re-fetch with the relation
          const updated = await strapi.documents('api::course-section.course-section').findOne({
            documentId: result.documentId,
            populate: ['course'],
          });
  
          return this.transformResponse(updated);
        }
  
        return this.transformResponse(result);

      } catch (error) {
        console.log(error);
        throw { error: errorCodes['E0019'] }
      }
    },
  })
);