export default {
    routes: [
        {
            method: "GET",
            path: "/user-info",
            handler: "user-info.find",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/user-info/:id",
            handler: "user-info.findOne",
            config: {
                auth: false,
            },
        },
    ],
};