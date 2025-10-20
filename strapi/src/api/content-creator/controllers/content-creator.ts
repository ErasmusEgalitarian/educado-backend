/**
 * content-creator controller
 */

import { factories } from '@strapi/strapi'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export default factories.createCoreController('api::content-creator.content-creator',({strapi}) => ({
    async register(ctx){
        try{
            const institutionalMails = ["student.aau.dk"];
            const {name, lastName, email, password } = ctx.request.body;

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
                    firstName: name,
                    lastName: lastName,
                    verifiedAt: confirmationDate
                }
            })

            ctx.send({
                message: isTrusted 
                ? `User registered and auto-approved on ${confirmationDate.toISOString()}.`
                : 'Registration successful. Waiting for admin approval.'
            })

      
        
        }
        catch(err){
            ctx.badRequest('Registration failed', {error: err.message});
        }
        
        //list of institutional mails, use aau to start

        // access request data
        // name, surname, email, password, isauthorised bool, 

        //check if exist

        //maybe ***encrypt password***

        // is mail institutional
        
        

        //make user

        // 

        




    }




}));
