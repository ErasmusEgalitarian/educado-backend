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
  ],
};
