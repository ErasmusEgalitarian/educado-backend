

export default {
  routes: [
      {
          method: 'POST',
          path: '/content-creator/login',
          handler: 'content-creator.login',
          config: {
              auth: false,
              policies: ['global::rate-limit'],
          },
      },
    {
       method: "PATCH",
       path: "/content-creators/:id/status",
       handler: "content-creator.updateStatus",
       config: {
              auth: false,
              policies: ["global::is-admin"],
          },
    },
  ],
};
