module.exports = {
  routes: [
    {
      method: "POST",
      path: "/course-statistics/statistics-action",
      handler: "course-statistics.statisticsAction",
      config: {
        policies: ['global::is-content-creator'],
        auth: false,
      },
    },
  ],
};
