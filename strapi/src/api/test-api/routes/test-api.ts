export default {
  routes: [
    {
     method: 'POST',
     path: '/test-api',
     handler: 'test-api.exampleAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
