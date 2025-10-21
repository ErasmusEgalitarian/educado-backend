/* finding the user by provided email, comparing the provided password with the stored hashed password using bcrypt,
 * and finally generating a JWT token upon successful authentication.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default {
  loginAction: async (ctx, next) => {
    try {
      //gets secret key from .env, if not found returns server error
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        strapi.log.error("JWT_SECRET missing in environment variables");
        return ctx.internalServerError("Server configuration error", {
          code: "AUTH_CONFIG_ERROR",
        });
      }

      // Extract email and password from request body
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest("Email and password are required", {
          code: "MISSING_CREDENTIALS",
        });
      }

      // making email lower case and removing spaces so that it matches the stored email format
      const emailNormalized = email.trim().toLowerCase();

      // extracting the user from db by the provided email
      const user = await strapi.db.query("api::student.student").findOne({
        where: { email: emailNormalized },
      });

      if (!user) {
        return ctx.unauthorized("Invalid credentials", {
          code: "USER_NOT_FOUND",
        });
      }
      // Password comparision using bcrypt
      const validPassword = await bcrypt.compare(
        password.trim(),
        user.password
      );
      if (!validPassword) {
        return ctx.unauthorized("Invalid credentials", {
          code: "INVALID_PASSWORD",
        });
      }
      // Generate JWT token using selected user fields
      const studentJWT = {
        documentId: user.documentId,
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
      };

      const jwtToken = jwt.sign(studentJWT, secretKey);

      ctx.response.body = JSON.stringify(jwtToken);
    } catch (err) {
      strapi.log.error("Login failed:", err);
      return ctx.internalServerError("Unexpected server error", {
        code: "SERVER_ERROR",
      });
    }
  },
};
