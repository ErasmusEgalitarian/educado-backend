export default {
  routes: [
    {
      method: "GET",
      // Get total certificates issued by a content creator
      path: "/course-statistics/creator/:id/certificates/total",
      // and the handler function in the controller
      handler: "course-statistics.creatorCertificatesCount",
      config: {
        auth: false,
      },
    },
  ],
};
