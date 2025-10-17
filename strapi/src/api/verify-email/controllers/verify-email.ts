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
      const { email, tokenCode }: { email: string; tokenCode: string } = ctx.request.body;
      const lowercaseEmail = email.toLowerCase();

      //TODO prop needs safety check

      // Finds verification token with matching email
      let Vtoken = await strapi.documents('api::verification-token.verification-token').findFirst(
        {
          filters: {
            userEmail: lowercaseEmail
          }
        }
      );
      if (!Vtoken) {
        return ctx.badRequest('Could not find token');
      }

      // Checks if code is correct
      if (!(Vtoken.token == tokenCode)) {
        return ctx.badRequest('token code does not match');
      }

      // Verifies user if code is correct
      let user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if (!user) {
        return ctx.badRequest('Could not find matching user');
      }
      await strapi.documents('api::student.student').update({
        documentId: user.documentId,
        data: { isVerified: true }
      });

      let signedUser = jwt.sign(user, secretKey);

      ctx.response.body = JSON.stringify(signedUser);

    } catch (err) {
      ctx.body = err;
    }
  }
};
