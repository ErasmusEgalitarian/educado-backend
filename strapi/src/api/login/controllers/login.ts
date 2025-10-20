import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from "koa";

// Helper function to get JWT secret key from environment variables
const getSecretKey = (): string | null => {
  const key = process.env.JWT_SECRET;
  if (!key)
    strapi.log.error("JWT_SECRET is not defined in environment variables.");
  return key || null;
};

// Helper function to validate the input credentials and normalize email format
const validateInput = (email?: string, password?: string) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!normalizedEmail || !trimmedPassword) {
    return {
      valid: false,
      error: {
        code: "MISSING_CREDENTIALS",
        message: "Please ensure both email and password fields are filled.",
      },
    };
  }

  return { valid: true, email: normalizedEmail, password: trimmedPassword };
};

// Helper function to find user by email in the database
const findUserByEmail = async (email: string) => {
  return strapi.db.query("api::student.student").findOne({ where: { email } });
};

// Helper function to generate JWT token
const generateJwt = (user: any, secret: string) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });
};

// Main login controller action
export default {
  loginAction: async (ctx: Context) => {
    const secretKey = getSecretKey();
    if (!secretKey) {
      return ctx.internalServerError("Server configuration error.", {
        code: "AUTH_CONFIG_ERROR",
        message: "The server is not configured correctly for authentication.",
      });
    }

    // Extract email and password from request body
    const { email, password } = ctx.request.body;
    const input = validateInput(email, password);
    if (!input.valid) {
      return ctx.badRequest("Email and password are required.", input.error);
    }

    try {
      const user = await findUserByEmail(input.email);
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        return ctx.unauthorized("Invalid identifier or password.", {
          code: "INVALID_CREDENTIALS",
          message: "The email or password provided is incorrect.",
        });
      }

      const jwtToken = generateJwt(user, secretKey);
      ctx.send(
        { user: { id: user.id, email: user.email }, jwt: jwtToken },
        200
      );
    } catch (err) {
      strapi.log.error(`Login failed for email ${input.email}:`, err);
      ctx.internalServerError(
        "An unexpected server error occurred during login.",
        {
          code: "SERVER_ERROR",
          message:
            "A temporary service issue prevented login. Please try again.",
        }
      );
    }
  },
};
