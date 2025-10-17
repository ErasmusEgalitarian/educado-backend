export default {
  routes: [
     {
      method: 'POST',
      path: '/verify-email',
      handler: 'verify-email.verifyAction',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
