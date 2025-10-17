export default {
  routes: [
    {
     method: 'POST',
     path: '/login',
     handler: 'login.loginAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
