import { errorCodes } from "../../../helpers/errorCodes";

interface Feedback {
  rating: number;
}

export default {
    async getAverageCourseFeedback(ctx) {
      try {
            const courseId = ctx.params.courseId;
            const course = await strapi.documents("api::course.course").findOne({
              documentId: courseId,
              populate: ["feedbacks"],
            });
    
            if (!courseId) {
              ctx.response.status = 500;
              ctx.response.body = { error: errorCodes["E0006"] };
            }
    
            const feedbacksArray = (course.feedbacks ?? []) as Feedback[];
    
            const averageCourseRating =
              feedbacksArray.length > 0
                ? feedbacksArray.reduce((accumulator, currentValue) => accumulator + (currentValue.rating ?? 0), 0) / feedbacksArray.length
                : 0;
    
            return {
              total: Number(averageCourseRating.toFixed(1)),
            };
    
          } catch (err) {
          ctx.response.status = 500;
          ctx.body = err;
          }
        }
}