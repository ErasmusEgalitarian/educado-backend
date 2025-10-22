/**
 * A set of functions called "actions" for `signup`
 */
import { sendVerificationEmail } from "../../../helpers/email";
import { errorCodes } from "../../../helpers/errorCodes";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutes

export default {
  signupAction: async (ctx, next) => {
    try {
      const secretKey = process.env.JWT_SECRET;

      // Deconstructing request body into fields
      const { name, email, password } = ctx.request.body;
      // Type checking
      if (typeof email !== 'string') {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0216'] };
      }
      if (typeof name !== 'string') {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0216'] };
      }
      if (typeof password !== 'string') {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0216'] };
      }

      // Convert email to lowercase
      const lowercaseEmail = email.toLowerCase();

      // student doesn't already excist
      const user = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if (!(user == null)) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0201'] };
      }

      let studentJWT;
      try {
        studentJWT = await generateStudentDraftAndPublish(name, lowercaseEmail, password)
      } catch (err) {
        const user = await strapi.documents('api::student.student').findFirst({
          filters: {
            email: email
          }
        }
        );
        if (user) {
          await strapi.documents('api::student.student').delete({ documentId: user.documentId });
        }
        ctx.response.status = 400;
        return ctx.badRequest(err);
      }

      ctx.response.body = jwt.sign(studentJWT, secretKey, { expiresIn: '7d' });

    } catch (err) {
      ctx.body = err;
    }
  },
  sendVerificationTokenAction: async (ctx, next) => {
    try {

      const { email } = ctx.request.body;
      const lowercaseEmail = email.toLowerCase();
      if (!lowercaseEmail) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0208'] };
      }

      // student with that email does not excist or is already verifed
      const student = await strapi.documents('api::student.student').findFirst(
        {
          filters: {
            email: lowercaseEmail
          }
        }
      );
      if ((student == null) || !(student.verifiedAt == null)) {
        ctx.response.status = 400;
        return ctx.response.body = { error: errorCodes['E0501'] };
      }


      // Find all existing verfication tokens for the student, and deletes them
      let existingTokens = await strapi.documents('api::verification-token.verification-token').findMany({
        filters: {
          userEmail: lowercaseEmail
        }
      });
      for (const token of existingTokens) {
        await strapi.documents('api::verification-token.verification-token').delete({ documentId: token.documentId });
      }

      //generate token code and send email
      const tokenString = generateTokenCode(4);
      sendVerificationEmail({ name: student.name, email: email }, tokenString);

      //creates a email verification token that expires in 10 min
      const verificationTokenResponse = await strapi.documents('api::verification-token.verification-token').create({
        data: {
          userEmail: lowercaseEmail,
          token: tokenString,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME)
        }
      });
      // Safety check
      if (!verificationTokenResponse) {
        ctx.response.status = 500;
        return ctx.response.body = { error: errorCodes['E0217'] };
      }

      ctx.response.body = 'ok';

    } catch (err) {
      ctx.body = err;
    }
  },
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
        data: { verifiedAt: new Date(Date.now()) }
      });

      //TODO maybe check if is verified now

      const userPublished = await strapi.documents('api::student.student').publish({
        documentId: user.documentId
      });
      const studentEntry = userPublished.entries[0];

      const studentJWT: Student = {
        documentId: userPublished.documentId,
        name: studentEntry.name,
        email: studentEntry.email,
        password: studentEntry.password,
        verifiedAt: new Date(studentEntry.verifiedAt)
      }

      const signedUser = jwt.sign(studentJWT, secretKey, { expiresIn: '7d' });

      ctx.response.body = JSON.stringify(signedUser);

    } catch (err) {
      ctx.body = err;
    }
  }
};

// Utility functions
function generateTokenCode(length) {
  let result = '';
  const characters = '0123456789'; // Only numbers
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generateStudentDraftAndPublish(name: string, email: string, password: string) {
  // Create draft for new student with required fields
  let studentResponse;
  studentResponse = await strapi.documents('api::student.student').create({
    data: {
      name: name,
      email: email,
      password: password
    }
  });

  //publish student
  const studentPublished = await strapi.documents('api::student.student').publish({
    documentId: studentResponse.documentId
  });
  const studentEntry = studentPublished.entries[0];

  const studentJWT: Student = {
    documentId: studentPublished.documentId,
    name: studentEntry.name,
    email: studentEntry.email,
    password: studentEntry.password,
    verifiedAt: new Date(studentEntry.verifiedAt)
  }

  return studentJWT;
}