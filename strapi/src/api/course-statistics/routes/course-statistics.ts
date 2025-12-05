module.exports = {
  routes: [
    {
      method: "POST",
      path: "/course-statistics",
      handler: "course-statistics.statisticsAction",
      config: {
        policies: ['global::is-content-creator'],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/course-statistics/:courseId/average",
      handler: "course-statistics-feedback.getAverageCourseFeedback",
      config: {
        policies: ['global::is-content-creator'],
        auth: false,
      },
    },
  ],
};
