export default {
  routes: [
    {
     method: 'POST',
     path: '/signup',
     handler: 'signup.signupAction',
     config: {
       policies: ['global::rate-limit'],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/studentVerificationTokenRequest',
     handler: 'signup.sendVerificationTokenAction',
     config: {
       policies: ['global::rate-limit'],
       middlewares: [],
     },
    },
  ],
};
