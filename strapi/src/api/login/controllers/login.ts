/* finding the user by provided email, comparing the provided password with the stored hashed password using bcrypt,
 * and finally generating a JWT token upon successful authentication.
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
        return ctx.badRequest("Email and password are required");
      }
      // extracting the user from db by the provided email
      const user = await strapi.db.query("api::student.student").findOne({
        where: { email },
      });

      if (!user) {
        return ctx.unauthorized("Can not find email");
      }
      // Password comparision using bcrypt
      const validPassword = await bcrypt.compare(
        password.trim(),
        user.password
      );
      if (!validPassword) {
        return ctx.unauthorized("Invalid password");
      }

      // Generate JWT token and assign to user
      let signedUser = jwt.sign(user, secretKey);

      ctx.response.body = JSON.stringify(signedUser);
    } catch (err) {
      ctx.body = err;
    }
  },
};
