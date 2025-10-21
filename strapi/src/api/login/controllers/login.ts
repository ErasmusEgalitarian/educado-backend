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
        return;
      }

      // Extract email and password from request body
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: errorCodes['E0101'] }
        return;
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
        return;
      }
      // Password comparision using bcrypt
      const validPassword = await bcrypt.compare(
        password.trim(),
        user.password
      );
      if (!validPassword) {
        createUserLog(user, false);
        ctx.response.status = 400;
        ctx.response.body = { error: errorCodes['E0106'] }
        return;
      }
      // Generate JWT token using selected user fields
      const studentJWT : Student = {
        documentId: user.documentId,
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
      };

      //log successful login
      createUserLog(user, true);

      const jwtToken = jwt.sign(studentJWT, secretKey, { expiresIn: '7d'});

      ctx.response.body = JSON.stringify(jwtToken);
    } catch (err) {
      strapi.log.error("Login failed:", err);
      ctx.response.status = 500;
      ctx.response.body = { error: errorCodes['E0019'] }
    }
  },
};




async function createUserLog(user, isSuccessful) {
  const sucessLog = await strapi.documents('api::user-log.user-log').create({
    data: {
        loginDate: new Date(Date.now()),
        isSuccessful: isSuccessful,
        student: user.documentId
    }
  });
  if (!sucessLog){
    return;
  }
}
