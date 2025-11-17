/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi'
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { errorCodes } from '../../../helpers/errorCodes';
import { sendVerificationEmail } from '../../../helpers/email';

export default factories.createCoreController('api::content-creator.content-creator',({strapi}) => ({
    async register(ctx){
        try{
            const institutionalMails = ["student.aau.dk"];
            const {firstName, lastName, email, password } = ctx.request.body;

            const existing = await strapi.db.query('api::content-creator.content-creator').findOne({
            where: { email },
            });

            if (existing){
                return ctx.badRequest('Email already in use')
            }
                
            const encryptedPassword = await bcrypt.hash(password,10)
            const domain = email.split('@')[1]?.toLowerCase();
            const isTrusted = institutionalMails.includes(domain)
            
            const confirmationDate = isTrusted ? new Date() : null;

            const newUser = await strapi.db.query('api::content-creator.content-creator').create({
                data:{
                    email: email,
                    password: encryptedPassword,
                    firstName: firstName,
                    lastName: lastName,
                    verifiedAt: confirmationDate
                }
            })

            ctx.send({
          status: isTrusted ? 'approved' : 'pending',
          userId: newUser.id,
          verifiedAt: confirmationDate,
          message: isTrusted
            ? `User registered and auto-approved on ${confirmationDate!.toISOString()}.`
            : 'Registration successful. Waiting for admin approval.',
        });

        // Utility functions
        function generateTokenCode(length) {
            let result = '';
            const characters = '0123456789'; // Only numbers
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
  

        sendVerificationEmail(newUser, generateTokenCode(4));
        
        }
        catch(err){
            ctx.badRequest('Registration failed', {error: err.message});
        }
        
               

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
