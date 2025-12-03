export default {
  routes: [
    {
      method: "GET",
      path: "/feedback/:courseId/average",
      handler: "feedback.getAverageCourseFeedback",
      config: {
        auth: false,
      },
    },
  ],
};