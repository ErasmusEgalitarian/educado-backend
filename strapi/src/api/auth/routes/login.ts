export default {
  routes: [
    {
      method: 'POST',
      path: '/login',
      handler: 'auth.login',
      config: {
        auth: false, // false = public endpoint
        policies: [/* 'global::rate-limit' */],
      },
    },
  ],
};
