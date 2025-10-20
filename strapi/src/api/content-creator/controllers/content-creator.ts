/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi'
import  jwt  from "jsonwebtoken";

export default factories.createCoreController('api::content-creator.content-creator', ({ strapi }) => ({
    async login(ctx) {
        try {
        // Access request data via ctx.request.body
        const { email, password } = ctx.request.body;

        const user = await strapi.db.query('api::content-creator.content-creator').findOne({
            where: { email },
            });

        if (!user) {
        return ctx.badRequest('Invalid email or password', {
            error: { code: 'E0004', message: 'Invalid email or password '}
        });
        }

        const isValidPassword = password.compare(user.password); // implement password validation logic here


        if (!isValidPassword) {
        return ctx.badRequest('Invalid email or password', {
            error: { code: 'E0004', message: 'Invalid email or password'}
        });
        }

        if (!user.confirmed) {
        return ctx.badRequest('Admin approval is required.', {
            error: { code: 'E1001', message: 'Admin approval is required'}
        });
        }


      
        // 3. Generate token
        const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        // 4. Respond with token and user info
        ctx.send({
        jwt: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        });
        } catch (err) {
        ctx.body = err;
        }
    },
}));
