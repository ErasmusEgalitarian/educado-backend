export default {
  routes: [
    {
      method: "GET",
      path: "/feedback",
      handler: "feedback.getAverageCourseFeedback",
      config: {
        auth: false,
      },
    },
  ],
};