/**
 * A set of functions called "actions" for `verify-email`
 */

import jwt from "jsonwebtoken"

export default {
  verifyAction: async (ctx, next) => {
    try {

      //gets secret key from .env
      const secretKey = process.env.JWT_SECRET;

      // De constructing request body into fields
      const { email, tokenCode } = ctx.request.body;
      if (typeof email !== 'string' || typeof tokenCode !== 'string') {
        return ctx.badRequest('Invalid request: both email and tokenCode must be strings');
      }
      const lowercaseEmail = email.toLowerCase();

      // Finds verification token with matching email
      const Vtoken = await strapi.documents('api::verification-token.verification-token').findFirst(
        {
          filters: {
            userEmail: lowercaseEmail
          }
        }
      );
      if (!Vtoken) {
        console.log("cant find Vtoken");
        return ctx.badRequest('Could not find token');
      }

      // Checks if code is correct and expired
      if (!(Vtoken.token == tokenCode && new Date(Vtoken.expiresAt) > new Date(Date.now()))) {
        return ctx.badRequest('token code does not match or is expired');
      }

      // Verifies user if code is correct
      const user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if (!user) {
        console.log('Could not find matching user');
        return ctx.badRequest('Could not find matching user');
      }
      await strapi.documents('api::student.student').update({
        documentId: user.documentId,
        data: { isVerified: true }
      });

      //TODO maybe check if is verified now

      const userPublished = await strapi.documents('api::student.student').publish({
      documentId: user.documentId
      });
      const studentEntry = userPublished.entries[0];

      const studentJWT : Student = {
        documentId: userPublished.documentId,
        name: studentEntry.name,
        email: studentEntry.email,
        password: studentEntry.password,
        isVerified: studentEntry.isVerified
      }

      const signedUser = jwt.sign(studentJWT, secretKey);

      ctx.response.body = JSON.stringify(signedUser);

    } catch (err) {
      ctx.body = err;
    }
  }
};
