
export default {
  routes: [
    {
      method: 'GET',
      path: '/CC-dashboard-activity',
      handler: 'custom-dashboard-activity.dashboardUserAction',
      config: {
        auth: false,
        policies: ['global::is-content-creator','global::rate-limit'],
      },
    },
  ],
};
