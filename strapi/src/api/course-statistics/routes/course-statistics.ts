module.exports = {
  routes: [
    {
      method: "GET",
      path: "/course-statistics/statistics-action",
      handler: "course-statistics.statisticsAction",
      config: {
        auth: false,
      },
    },
  ],
};
