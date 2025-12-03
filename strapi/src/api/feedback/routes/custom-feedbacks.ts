export default {
  routes: [
    {
      method: "GET",
      path: "/feedback",
      handler: "feedback.getAverageCourseFeedback",
      config: {
        policies: ['global::is-content-creator'],
        auth: false,
      },
    },
  ],
};