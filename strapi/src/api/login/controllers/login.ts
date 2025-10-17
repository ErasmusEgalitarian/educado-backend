/**
 * A set of functions called "actions" for `login`
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default {
  loginAction: async (ctx, next) => {
    try {

      //gets secret key from .env
      const secretKey = process.env.JWT_SECRET;

      // Extract email and password from request body
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest('Email and password are required');
      }
      // Fetch user from custom 'student' collection type
      // api is the API namespace, student is the collection type
      // plugin if you are using a plugin, e.g., users-permissions given by default see in jwtService below
      const user = await strapi.db.query('api::student.student').findOne({
        where: { email },
      });

      if (!user) {
        return ctx.unauthorized('Can not find email');
      }


      console.log(password);
      console.log(user.password);
      //HERE
      const validPassword = await bcrypt.compare(password.trim(), user.password);
      if (!validPassword) {
        return ctx.unauthorized("Invalid password");
      }

      // Generate JWT token and assign to user 
      let signedUser = jwt.sign(user, secretKey);

      ctx.response.body = JSON.stringify(signedUser);
    } catch (err) {
      ctx.body = err;
    }
  }
};
