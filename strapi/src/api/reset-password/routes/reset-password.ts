export default {
  routes: [
    {
     method: 'POST',
     path: '/reset-password-request',
     handler: 'reset-password.requestHandler',
     config: {
       policies: ['global::rate-limit'],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/reset-password-code',
     handler: 'reset-password.codeHandler',
     config: {
       policies: ['global::rate-limit'],
       middlewares: [],
     },
    },
  ],
};
