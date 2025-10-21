/**
 * A set of functions called "actions" for `signup`
 */

const TOKEN_EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutes

function generateTokenCode(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

import { sendVerificationEmail } from "../helpers/email";
import jwt from "jsonwebtoken";


export default {
  signupAction: async (ctx, next) => {
    try {
      const secretKey = process.env.JWT_SECRET;

      // Deconstructing request body into fields
      const { name, email, password } = ctx.request.body;
      // Type checking
      if (typeof email !== 'string') {
        return ctx.badRequest('Invalid request: email is not type string but '+typeof email);
      }
      if (typeof name !== 'string'){
        return ctx.badRequest('Invalid request: name is not type string but '+typeof name);
      }
      if (typeof password !== 'string'){
        return ctx.badRequest('Invalid request: name is not type string but '+typeof name);
      }

      // Convert email to lowercase
      const lowercaseEmail = email.toLowerCase();

      // student doesn't already excist
      const user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if (!(user == null)){
        return ctx.badRequest('student with that email already excist');
      }

      // Create draft for new student with required fields
      const studentResponse = await strapi.documents('api::student.student').create({
        data: {
          name: name,
          email: lowercaseEmail,
          password: password
        }
      });
      // Safety check
      if (!studentResponse && !studentResponse.id) {
      return ctx.internalServerError('Failed to create student.');
      }
      
      //publish student if it passes check.
      const studentPublished = await strapi.documents('api::student.student').publish({
        documentId: studentResponse.documentId
      });
      const studentEntry = studentPublished.entries[0];
      
      const studentJWT : Student = {
        documentId: studentPublished.documentId,
        name: studentEntry.name,
        email: studentEntry.email,
        password: studentEntry.password,
        verifiedAt: new Date(studentEntry.verifiedAt)
      }

      ctx.response.body = jwt.sign(studentJWT, secretKey);

    } catch (err) {
      ctx.body = err;
    }
  },

  sendVerificationTokenAction: async (ctx, next) => {
    try {

      const { name, email } = ctx.request.body;
      const lowercaseEmail = email.toLowerCase();
      if(!lowercaseEmail || !name){
        return ctx.badRequest('email and or name field is empty');
      }

      // student with that email does not excist or is already verifed
      const student = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if ((student == null) || !(student.verifiedAt == null)){
        return ctx.badRequest('student with that email does not excist or is already verifed');
      }

      //generate token code and send email
      const tokenString = generateTokenCode(4);
      sendVerificationEmail({name: name, email: email}, tokenString);

      //creates a email verification token that expires in 10 min
      const verificationTokenResponse = await strapi.documents('api::verification-token.verification-token').create({
        data: {
            userEmail: lowercaseEmail,
            token: tokenString,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME)
        }
      })
      // Safety check
      if (!verificationTokenResponse){
        return ctx.internalServerError('Failed to create verfication token.');
      }

      ctx.response.body = 'ok';

    } catch (err) {
      ctx.body = err;
    }
  }
};

