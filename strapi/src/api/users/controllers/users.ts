import type { Context } from "koa";

interface ContentCreatorDoc {
    documentId: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    statusValue: string;
    isAdmin?: boolean;
    createdAt?: string;
}

/**
 * Admin operations on Content Creators, exposed as /api/users/*
 */
const usersController = {
    // GET /api/users/:id
    async findOne(ctx: Context) {
        const { id } = ctx.params; // this is documentId

        try {
            const creator = (await strapi
                .documents("api::content-creator.content-creator")
                .findFirst({
                    filters: { documentId: id },
                })) as ContentCreatorDoc | null;

            if (!creator) {
                return ctx.notFound("Content creator not found");
            }

            const data = {
                _id: creator.documentId,
                firstName: creator.firstName,
                lastName: creator.lastName,
                email: creator.email,
                // TODO: replace APPROVED/REJECTED with real statusValue enums
                approved: creator.statusValue === "APPROVED",
                rejected: creator.statusValue === "REJECTED",
                isAdmin: !!creator.isAdmin,
                joinedAt: creator.createdAt,
            };

            ctx.body = data;
        } catch (err) {
            strapi.log.error("Error in users.findOne", err);
            return ctx.internalServerError("Unable to fetch content creator");
        }
    },

    // DELETE /api/users/:id
    async delete(ctx: Context) {
        const { id } = ctx.params; // documentId

        try {
            await strapi
                .documents("api::content-creator.content-creator")
                .delete({
                    documentId: id,
                });

            ctx.body = { ok: true };
        } catch (err) {
            strapi.log.error("Error in users.delete", err);
            return ctx.internalServerError("Unable to delete content creator");
        }
    },

    // PATCH /api/users/:id/role
    async changeRole(ctx: Context) {
        const { id } = ctx.params; // documentId
        const { newRole } = ctx.request.body as { newRole?: string };

        if (!newRole) {
            return ctx.badRequest("newRole is required");
        }

        const isAdmin = newRole === "admin";

        try {
            const updated = (await strapi
                .documents("api::content-creator.content-creator")
                .update({
                    documentId: id,
                    data: { isAdmin },
                })) as ContentCreatorDoc;

            const data = {
                _id: updated.documentId,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                approved: updated.statusValue === "APPROVED",
                rejected: updated.statusValue === "REJECTED",
                isAdmin: !!updated.isAdmin,
                joinedAt: updated.createdAt,
            };

            ctx.body = data;
        } catch (err) {
            strapi.log.error("Error in users.changeRole", err);
            return ctx.internalServerError("Unable to change role");
        }
    },
};

export default usersController;