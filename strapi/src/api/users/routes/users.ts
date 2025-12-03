export default {
    routes: [
        {
            method: "GET",
            path: "/users/:id",
            handler: "users.findOne",
            config: {
                policies: ["global::is-admin"],
            },
        },
        {
            method: "DELETE",
            path: "/users/:id",
            handler: "users.delete",
            config: {
                policies: ["global::is-admin"],
            },
        },
        {
            method: "PATCH",
            path: "/users/:id/role",
            handler: "users.changeRole",
            config: {
                policies: ["global::is-admin"],
            },
        },
    ],
};