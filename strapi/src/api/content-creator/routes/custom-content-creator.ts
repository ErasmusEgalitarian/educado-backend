export default {
    routes: [
        {
            method: 'POST',
            path: '/content-creator/login',
            handler: 'content-creator.login',
            config: {
                auth: false,
                policies: ['global::rate-limit'],
            },
        },
        {
            method: 'POST',
            path: '/content-creator/register',
            handler: 'content-creator.register',
            config: {
                auth: false,
            },
        }
    ],
};
