export default {
    routes: [
        {
            method: "GET",
            path: "/user-info",
            handler: "user-info.find",
        },
        {
            method: "GET",
            path: "/user-info/:id",
            handler: "user-info.findOne",
            config: {
                policies: ["global::is-admin"],
            },
        },
    ],
};