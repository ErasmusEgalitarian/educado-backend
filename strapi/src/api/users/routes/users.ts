export default {
    routes: [
        {
            method: "GET",
            path: "/users/:id",
            handler: "users.findOne",
            config: {
                policies: ["global::is-admin"],
                auth: false,
            },
        },
        {
            method: "DELETE",
            path: "/users/:id",
            handler: "users.delete",
            config: {
                policies: ["global::is-admin"],
                auth: false,
            },
        },
        {
            method: "PATCH",
            path: "/users/:id/role",
            handler: "users.changeRole",
            config: {
                policies: ["global::is-admin"],
                auth: false,
            },
        },
    ],
};