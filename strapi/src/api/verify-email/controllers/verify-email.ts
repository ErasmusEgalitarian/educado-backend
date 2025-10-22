/**
 * A set of functions called "actions" for `verify-email`
 */

import { errorCodes } from "../../../helpers/errorCodes";
import jwt from "jsonwebtoken"

export default {
  verifyAction: async (ctx, next) => {
    try {

      //gets secret key from .env
      const secretKey = process.env.JWT_SECRET;

      // De constructing request body into fields
      const { email, tokenCode } = ctx.request.body;
      if (typeof email !== 'string' || typeof tokenCode !== 'string') {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0505'] }
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
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0504'] }
      }

      // Checks if code is correct and expired
      if (!(Vtoken.token == tokenCode && new Date(Vtoken.expiresAt) > new Date(Date.now()))) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0001'] }
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
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0004'] }
        
      }
      await strapi.documents('api::student.student').update({
        documentId: user.documentId,
        data: { verifiedAt: new Date(Date.now()) }
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
        verifiedAt: new Date(studentEntry.verifiedAt)
      }

      const signedUser = jwt.sign(studentJWT, secretKey, { expiresIn: '7d'});

      ctx.response.body = JSON.stringify(signedUser);

    } catch (err) {
      ctx.response.body = { error: errorCodes['E0000'] }
    }
  }
};
