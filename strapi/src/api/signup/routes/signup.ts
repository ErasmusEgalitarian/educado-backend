export default {
  routes: [
    {
     method: 'POST',
     path: '/signup',
     handler: 'signup.signupAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/studentVerificationTokenRequest',
     handler: 'signup.sendVerificationTokenAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
