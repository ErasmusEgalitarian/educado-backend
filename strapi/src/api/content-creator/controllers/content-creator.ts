/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi'
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export default factories.createCoreController('api::content-creator.content-creator', ({ strapi }) => ({
    async login(ctx) {
        try {
        // Access request data via ctx.request.body
        const { email, password } = ctx.request.body;

        const user = await strapi.documents('api::content-creator.content-creator').findFirst({
            filters: { email: email },
            });

        if (!user) {
            return ctx.badRequest('Invalid email or password', {
            error: { code: 'E0004', message: 'Invalid email or password '}});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return ctx.badRequest('Invalid email or password', {
                error: { code: 'E0004', message: 'Invalid email or password'}});
        }

        if (user.verifiedAt == null) {
            return ctx.badRequest('Admin approval is required.', {
                error: { code: 'E1001', message: 'Admin approval is required'}});
        }


      
        // 3. Generate token
        const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        // 4. Respond with token and user info
        return ctx.send({
            jwt: token,
            user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            },
        });
        } catch (err) {
        console.error(err);
            return ctx.internalServerError('Something went wrong');
        }
    },
}));
