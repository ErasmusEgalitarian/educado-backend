export default {
  routes: [
    {
      method: 'POST',
      path: '/student/signup',
      handler: 'student-registration.signupAction',
      config: {
        auth: false,
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/student/send-verification-token',
      handler: 'student-registration.sendVerificationTokenAction',
      config: {
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/student/verify-email',
      handler: 'student-registration.verifyAction',
      config: {
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
  ],
};