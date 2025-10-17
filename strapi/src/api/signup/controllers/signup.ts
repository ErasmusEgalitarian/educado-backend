/**
 * A set of functions called "actions" for `signup`
 */

const TOKEN_EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutes
const url = 'http://localhost:1337/api/'

function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

import { sendVerificationEmail } from "../helpers/email";

export default {
  signupAction: async (ctx, next) => {
    try {

      // Deconstructing request body into fields
      const { name, email, password } = ctx.request.body;
      if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string') {
        return ctx.badRequest('Invalid request: all fields should be strings');
      }

      // Convert email to lowercase
      const lowercaseEmail = email.toLowerCase();

      // student doesn't already excist
      let user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if (!(user == null)){
        return ctx.badRequest('student already excist');
      }
      // Create draft for new student with required fields
      let studentResponse = await strapi.documents('api::student.student').create({
        data: {
          name: name,
          email: lowercaseEmail,
          password: password
        }
      });
      // Safety check
      if (!studentResponse || !studentResponse.id) {
      return ctx.badRequest('Failed to create student.');
      }
      
      //publish student if it passes check.
      await strapi.documents('api::student.student').publish({
        documentId: studentResponse.documentId
      });


      //generate token code and send email
      const tokenString = makeid(4);
      sendVerificationEmail({name: name, email: email}, tokenString);

      //creates a email verification token that expires in 10 min
      let verificationTokenResponse = await strapi.documents('api::verification-token.verification-token').create({
        data: {
            userEmail: lowercaseEmail,
            token: tokenString,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME)
        }
      })

      ctx.response.body = 'ok';

    } catch (err) {
      ctx.body = err;
    }
  }
};
