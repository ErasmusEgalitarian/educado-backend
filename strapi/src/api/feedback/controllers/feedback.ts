/**
 * feedback controller
 */

import { factories } from '@strapi/strapi';
import { errorCodes } from "../../../helpers/errorCodes";


export default factories.createCoreController(
  'api::feedback.feedback',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::feedback.feedback')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
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

    async getAverageCourseFeedback(courseId) {
      try {
        const course = await strapi.documents("api::course.course").findFirst({
          documentId: courseId,
          populate: ["feedbacks"],
        });
        if (!courseId) {
          throw { error: errorCodes["E0004"] };
        }

        const feedbacksArray = (course.feedbacks ?? []) as { rating?: number }[];

        const averageCourseRating =
          feedbacksArray.length > 0
            ? feedbacksArray.reduce((accumulator, currentValue) => accumulator + (currentValue.rating ?? 0), 0) / feedbacksArray.length
            : 0;

        return {
          total: Number(averageCourseRating.toFixed(1)),
        };

      } catch (err) {
        throw { error: errorCodes['E0001'] }
      }
    }
  })
);


