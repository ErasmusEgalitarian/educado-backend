import { sendResetPasswordEmail } from "../helpers/email"
import { errorCodes } from "../../../helpers/errorCodes";

/**
 * A set of functions called "actions" for `reset-password`
 */
const TOKEN_EXPIRATION_TIME = 1000 * 60 * 5; // 5 minutes

const requestHandler = async (ctx, next) => {
  const tokenAPI = "api::student-password-reset-token.student-password-reset-token"
  // Get the student with the email
  const studentEmail = ctx.request.body.email;
  const student = await strapi.documents("api::student.student").findFirst({
    filters: {
      email: studentEmail
    }
  });

  // TODO: Implement error codes
  if (!studentEmail || !student) {
    ctx.response.status = 400;
    ctx.response.body = { error: errorCodes['E0004'] }
    return;
  }

  // TODO: Check reset attempts

// Find all tokens for the student
let existingTokens = await strapi.documents(tokenAPI).findMany({
  filters: {
    student: {
      documentId: student.documentId
    }
  }
});

for (const token of existingTokens) {
  await strapi.documents(tokenAPI).delete({ documentId: token.documentId });
}

  // Generate token
  let resetToken = generatePasswordResetToken();
  // TODO: Hash the resetToken before saving to the database

  // Save token to database with 5 minute expiration
  await strapi.documents(tokenAPI).create({
    data: {
      token: resetToken,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
      student: student.documentId
    }
  });
  
  // TODO: Send email with reset token
  const success = await sendResetPasswordEmail(student, resetToken);

  if (success) {
    ctx.response.status = 200;
    ctx.response.body = {status: 'success'};
  } else {
    ctx.response.status = 500;
    ctx.response.body = { error: errorCodes['E0004'] }
  }
}

const codeHandler = async (ctx, next) => {
  // 
  const resetToken = ctx.request.body.token;
  const studentEmail = ctx.request.body.email;
  const tokenAPI = "api::student-password-reset-token.student-password-reset-token";


  // Get student-password-reset-token with the email
  const tokenFound = await strapi.documents(tokenAPI).findFirst({
    filters: {
      student: {
        email: studentEmail
      }
    }
  })

  if (resetToken == tokenFound.token) {
    ctx.response.status = 200;
    ctx.response.body = {status: 'success'};
  } else {
    // TODO: Implement errorcodes: If token is invalid, return error E0405
    ctx.response.status = 500;
    ctx.response.body = { error: errorCodes['E0405'] }
    
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

export default {requestHandler, codeHandler};

