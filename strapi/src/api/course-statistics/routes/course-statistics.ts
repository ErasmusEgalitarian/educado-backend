export default {
  routes: [
     {
      method: 'GET',
      path: '/course-statistics',
      handler: 'course-statistics.statisticsAction',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
