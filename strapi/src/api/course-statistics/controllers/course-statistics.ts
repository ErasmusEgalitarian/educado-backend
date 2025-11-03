/**
 * A set of functions called "actions" for `course-statistics`
 */

import jwt, { JwtPayload } from "jsonwebtoken"

export default {
   statisticsAction: async (ctx, next) => {
     try {

      // Gets secret key from .env
      const secretKey = process.env.JWT_SECRET;

      // Extract the authenticated user from the policy context
      // This object is populated by Strapi when the user is logged in
      let user = jwt.verify(ctx.headers.authorization, secretKey);

      console.log(user);


       ctx.body = 'ok';
     } catch (err) {
       ctx.body = err;
     }
   }
};
