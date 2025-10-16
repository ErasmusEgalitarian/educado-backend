export default {
  routes: [
    {
     method: 'POST',
     path: '/reset-password-request',
     handler: 'reset-password.requestHandler',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/reset-password-code',
     handler: 'reset-password.codeHandler',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
