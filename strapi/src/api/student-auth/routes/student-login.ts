export default {
  routes: [
    {
      method: 'POST',
      path: '/student/login',
      handler: 'student-login.loginAction',
      config: {
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/student/reset-password-request',
      handler: 'student-login.passwordRequestAction',
      config: {
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/student/reset-password-code',
      handler: 'student-login.passwordCodeAction',
      config: {
        policies: ['global::rate-limit'],
        middlewares: [],
      },
    },
    {
      method: 'PATCH',
      path: '/student/reset-password-update',
      handler: 'student-login.passwordUpdateAction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
