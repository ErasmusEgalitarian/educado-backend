import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { errorCodes } from "../../../helpers/errorCodes";
import { sendResetPasswordEmail } from "../../../helpers/email"

const TOKEN_EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutes
const TOKEN_API = "api::password-reset-token.password-reset-token";


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
      const user = await strapi.documents("api::student.student").findFirst({
        filters: { email: emailNormalized },
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
        verifiedAt: new Date(user.verifiedAt),
      };

      //log successful login
      createUserLog(user, true);

      const jwtToken = jwt.sign(studentJWT, secretKey, { expiresIn: '7d' });

      ctx.response.body = JSON.stringify(jwtToken);
    } catch (err) {
      strapi.log.error("Login failed:", err);
      ctx.response.status = 500;
      ctx.response.body = { error: errorCodes['E0019'] }
    }
  },
  passwordRequestAction: async (ctx, next) => { 
    try {
      // Get the student with the email
      const studentEmail = ctx.request.body.email;
      const student = await strapi.documents("api::student.student").findFirst({
        filters: {
          email: studentEmail
        }
      });

      if (!studentEmail || !student) {
        ctx.response.status = 400;
        ctx.response.body = { error: errorCodes['E0004'] }
        return;
      }

      // Find all tokens for the student
      let existingTokens = await strapi.documents(TOKEN_API).findMany({
        filters: {
          userEmail: studentEmail
        }
      });
      for (const token of existingTokens) {
        await strapi.documents(TOKEN_API).delete({ documentId: token.documentId });
      }

      // Generate token
      let resetToken = generatePasswordResetToken();

      // Save token to database with 10 minute expiration
      await strapi.documents(TOKEN_API).create({
        data: {
          userEmail: student.email,
          token: resetToken,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME)
        }
      });

      const success = await sendResetPasswordEmail(student, resetToken);

      if (success) {
        ctx.response.status = 200;
        ctx.response.body = { status: 'success' };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: errorCodes['E0004'] }
      }
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = err;
    }
    
  },
  passwordCodeAction: async (ctx, next) => {
    try {
      const { resetTokenCode, studentEmail } = ctx.request.body;

      if (!resetTokenCode || !studentEmail) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0016'] }
      }

      // Get student-password-reset-token with the email
      const tokenFound = await strapi.documents(TOKEN_API).findFirst({
        filters: {
          userEmail: studentEmail
        }
      });

      if (resetTokenCode == tokenFound.token) {
        ctx.response.status = 200;
        ctx.response.body = { status: 'success' };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: errorCodes['E0405'] }
      }
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = err;
    }

  },
  passwordUpdateAction: async (ctx, next) => {
    try {
      const { email, token, newPassword } = ctx.request.body;

      if(typeof email !==  'string' || typeof token !== 'string' || typeof newPassword !== 'string'){
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0016'] }
      }
      const lowercaseEmail = email.toLowerCase();

      const passwordResetToken = await strapi.documents(TOKEN_API).findFirst({
        filters: {
          token: token,
          userEmail: email
        },
      });

      // If token is not provided or token is expired, return error E0404
      if (!(passwordResetToken.token == token && new Date(passwordResetToken.expiresAt) > new Date(Date.now()))) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0404'] }
      }

      const user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );

      await strapi.documents("api::student.student").update({
        documentId: user.documentId,
        data: {
          password: newPassword
        }
      });
      await strapi.documents('api::student.student').publish({
        documentId: user.documentId
      });

      ctx.response.status = 200;
      ctx.response.body = { status: "success" };
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = err;
    }
    
  }
};

// Utility functions
async function createUserLog(user, isSuccessful) {
  const sucessLog = await strapi.documents('api::user-log.user-log').create({
    data: {
      loginDate: new Date(Date.now()),
      isSuccessful: isSuccessful,
      student: user.documentId
    }
  });
  if (!sucessLog) {
    return;
  }
}

/**
 * Generates a random number between min and max
 * @param {Number} min - Minimum number
 * @param {Number} max - Maximum number
 * @returns {Number} Random number between min and max
 */
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePasswordResetToken() {
  const length = 4;
  let retVal = '';
  for (let i = 0; i < length; i++) {
    retVal += getRandomNumber(0, 9);
  }
  return retVal;
}