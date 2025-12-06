/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { errorCodes } from '../../../helpers/errorCodes';

export default factories.createCoreController('api::content-creator.content-creator', ({ strapi }) => ({
    async find(ctx) {
        const { results, pagination } = await strapi
            .service('api::content-creator.content-creator')
            .find({
                ...ctx.query,
            });

        return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
        const { id } = ctx.params;

        const result = await strapi
            .documents('api::content-creator.content-creator')
            .findOne({
                documentId: id,
                ...ctx.query,
            });

        return this.transformResponse(result);
    },

    async update(ctx) {
        // Remove password from the request if it's empty or not provided
        if (ctx.request.body?.data) {
            const password = ctx.request.body.data.password;
            // Trim and check for undefined, null, empty string, and whitespace
            if (typeof password !== 'string' || password.trim() === '') {
                delete ctx.request.body.data.password;
            }
        }

        // Call the default update controller
        return await super.update(ctx);
    },

    async login(ctx) {
        try {
            // Access request data via ctx.request.body
            const { email, password } = ctx.request.body;

            const user = await strapi.documents('api::content-creator.content-creator').findFirst({
                filters: { email: email.toLowerCase() },
            });

            if (!user) {
                return ctx.badRequest('Invalid email or password', {
                    error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return ctx.badRequest('Invalid email or password', {
                    error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }
                });
            }

            if (user.verifiedAt == null) {
                return ctx.badRequest('Admin approval is required.', {
                    error: { code: errorCodes.E1001.code, message: errorCodes.E1001.message }
                });
            }


            interface JwtContentCreatorPayload {
                documentId: string;
                firstName: string;
                lastName: string;
                email: string;
                verifiedAt: Date | null;
                isAdmin: boolean;
            }
        const jwtContentCreator : JwtContentCreatorPayload  = {
            documentId: user.documentId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : null,
            isAdmin: user.isAdmin,
        }
        // 3. Generate token
        const token = jwt.sign(
            jwtContentCreator,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 4. Respond with token and user info
        return ctx.send({
            accessToken: token,
            userInfo: {
                documentId: user.documentId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                verifiedAt: user.verifiedAt ? new Date(user.verifiedAt).toISOString() : null,
                isAdmin: !!user.isAdmin,
                role: user.isAdmin ? "admin" : "creator",
            },
        });
        } catch (err) {
            console.error(err);
            return ctx.internalServerError('Something went wrong');
        }
    },

    async updateStatus(ctx) {
        const { id } = ctx.params;
        const { statusValue, rejectionReason } = ctx.request.body;

        if (!statusValue) {
            return ctx.badRequest("statusValue is required");
        }

        const allowed = ["PENDING", "APPROVED", "REJECTED"];
        if (!allowed.includes(statusValue)) {
            return ctx.badRequest("Invalid statusValue");
        }

        const data: Record<string, unknown> = { statusValue };

        if (statusValue === "APPROVED") {
            data.verifiedAt = new Date().toISOString();
        }

        if (statusValue === "REJECTED") {
            (data as any).rejectionReason = rejectionReason ?? null;
        }

       try{
            await strapi.documents("api::content-creator.content-creator")
               .update({
                   documentId: id,
                   data,
               });

           const published = await strapi.documents("api::content-creator.content-creator").publish({
               documentId: id,
           });

           return ctx.send(published);

       } catch (err) {
           strapi.log.error("Error in content-creator.updateStatus", err);
           return ctx.internalServerError("Could not update status");
       }
    },
}));
