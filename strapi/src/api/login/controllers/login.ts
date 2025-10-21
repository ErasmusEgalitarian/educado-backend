/* finding the user by provided email, comparing the provided password with the stored hashed password using bcrypt,
 * and finally generating a JWT token upon successful authentication.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorCodes } from "../../../helpers/errorCodes";

export default {
  loginAction: async (ctx, next) => {
    try {
      //gets secret key from .env, if not found returns server error
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        strapi.log.error("JWT_SECRET missing in environment variables");
        ctx.response.status = 500;
        ctx.response.body = { error: errorCodes['E0020'] }
      }

      // Extract email and password from request body
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: errorCodes['E0101'] }
      }

      // making email lower case and removing spaces so that it matches the stored email format
      const emailNormalized = email.trim().toLowerCase();

      // extracting the user from db by the provided email
      const user = await strapi.db.query("api::student.student").findOne({
        where: { email: emailNormalized },
      });

      if (!user) {
        ctx.response.status = 400;
        ctx.response.body = { error: errorCodes['E0105'] }
      }
      // Password comparision using bcrypt
      const validPassword = await bcrypt.compare(
        password.trim(),
        user.password
      );
      if (!validPassword) {
        ctx.response.body = { error: errorCodes['E0106'] }
      }
      // Generate JWT token using selected user fields
      const studentJWT : Student = {
        documentId: user.documentId,
        name: user.name,
        email: user.email,
        password: user.password,
        verifiedAt: new Date(user.verifiedAt)
      }
      
      const jwtToken = jwt.sign(studentJWT, secretKey);

      ctx.response.body = JSON.stringify(jwtToken);
    } catch (err) {
      strapi.log.error("Login failed:", err);
      ctx.response.status = 500;
      ctx.response.body = { error: errorCodes['E0019'] }
    }
  },
};
