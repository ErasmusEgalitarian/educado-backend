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
  ],
};
