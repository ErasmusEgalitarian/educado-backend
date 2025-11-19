async function updateCourseAverage(courseId: string, excludeFeedbackId?: string) {
  // Fetch course with feedbacks
  const course = await strapi.documents('api::course.course').findOne({
    documentId: courseId,
    populate: {
      feedbacks: excludeFeedbackId
      ? {
        filters: {
          documentId: { $ne: excludeFeedbackId },
        },
      }
      : true,
    },
  });

  if (!course) return;

  const feedbacks = (course.feedbacks ?? []) as { rating?: number }[];

  const avg =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, fb) => acc + (fb.rating ?? 0), 0) / feedbacks.length
      : 0;

  // Only update if it changed
  if (course.averageRating !== avg) {
    await strapi.documents('api::course.course').update({
      documentId: courseId,
      data: { averageRating: avg },
      status: 'published',
    });
  }
}

// For create/update where we know feedbackId (documentId)
async function updateCourseAverageFromFeedback(feedbackId: string) {
  const feedback = await strapi.documents('api::feedback.feedback').findOne({
    documentId: feedbackId,
    populate: {
      course: {
        populate: ['feedbacks'],
      },
    },
  });

  const courseId = feedback?.course?.documentId;
  if (courseId) {
    await updateCourseAverage(courseId);
  }
}

export default {
  async afterCreate(event: any) {
    const feedbackId = event?.result?.documentId;
    if (feedbackId) {
      await updateCourseAverageFromFeedback(feedbackId);
    }
  },

  async afterUpdate(event: any) {
    const feedbackId = event?.result?.documentId;
    if (feedbackId) {
      await updateCourseAverageFromFeedback(feedbackId);
    }
  },

  async beforeDelete(event: any) {
    const feedbackDbId = event.params?.where?.id;
    if (!feedbackDbId) return;
    // We must fetch feedback BEFORE it's deleted
    const feedback = await strapi.documents('api::feedback.feedback').findMany({
      filters: { id: feedbackDbId },
      select: ['documentId'] as any,
      populate: {
        course: {
          fields: ['documentId'] as any,
        },
      },
    });

    const fb = feedback?.[0];
    const courseId = fb?.course?.documentId;

    if (courseId) {
      await updateCourseAverage(courseId, fb.documentId);
    }
  },
};
