export default {
    routes:[
        {
            method: 'POST',
            path:'/content-creator/register' ,
            handler: 'api::content-creator.content-creator.register',
            config: {
                auth:false,
                policies: ['global::rate-limit'],
            },
        },

      {
        method: 'POST',
        path: '/content-creator/login',
        handler: 'content-creator.login',
        config: {
          auth: false,
          policies: ['global::rate-limit'],
        },
      },
  ],
};