/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi'
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { errorCodes } from '../../../helpers/errorCodes';

export default factories.createCoreController('api::content-creator.content-creator', ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents('api::content-creator.content-creator')
            .findMany({
                ...ctx.query,
            });

        return this.transformResponse(result);
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

    async login(ctx) {
        try {
        // Access request data via ctx.request.body
        const { email, password } = ctx.request.body;

        const user = await strapi.documents('api::content-creator.content-creator').findFirst({
            filters: { email: email.toLowerCase() },
            });

        if (!user) {
            return ctx.badRequest('Invalid email or password', {
            error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return ctx.badRequest('Invalid email or password', {
                error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }});
        }

        if (user.verifiedAt == null) {
            return ctx.badRequest('Admin approval is required.', {
                error: { code: errorCodes.E1001.code, message: errorCodes.E1001.message }});
        }


      
        const jwtContentCreator : ContentCreator = { 
            documentId: user.documentId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : null,
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
            },
        });
        } catch (err) {
        console.error(err);
            return ctx.internalServerError('Something went wrong');
        }
    },
}));
