import loginController from "../../src/api/login/controllers/login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock external libraries to avoid real hashing or token generation
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("loginAction controller", () => {
  // Mocked Koa/Strapi context
  let ctx: any;
  // Fake user data for testing
  let mockUser: any;

  beforeEach(() => {
    // Sample user object returned by the DB mock
    mockUser = {
      documentId: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      verfiedAt: "01-01-2023",
    };

    // Mock request and response objects for each test
    ctx = {
      // Will be set per test
      request: { body: {} },
      // Default empty tests
      response: { status: 0, body: null },
    };

    // Provide a JWT secret for token generation
    process.env.JWT_SECRET = "secretkey";

    // Mock Strapi DB query
    (global as any).strapi = {
      db: {
        // Mock database query interface
        query: jest.fn().mockReturnValue({
          // Will be overridden in individual tests
          findOne: jest.fn(),
        }),
      },

      log: { error: jest.fn() }, // Mock logger
      documents: jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue({}), // Mock login logs
      }),
    };
  });
  // Test missing email or password
  it("returns 400 if email or password missing", async () => {
    ctx.request.body = {};
    await loginController.loginAction(ctx, null);
    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  // Test user not found in DB
  it("returns 400 if user not found", async () => {
    ctx.request.body = { email: "notfound@example.com", password: "123" };
    (
      strapi.db.query("api::student.student").findOne as jest.Mock
    ).mockResolvedValue(null);

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  // Test invalid password
  it("returns 400 if password is invalid", async () => {
    ctx.request.body = { email: "test@example.com", password: "wrongpass" };
    (
      strapi.db.query("api::student.student").findOne as jest.Mock
    ).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  // Test successful login
  it("returns JWT token on successful login", async () => {
    ctx.request.body = { email: "test@example.com", password: "password" };
    (
      strapi.db.query("api::student.student").findOne as jest.Mock
    ).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedtoken");

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(0); // default, no error set
    expect(ctx.response.body).toBe(JSON.stringify("mockedtoken"));
  });

  // Test missing JWT secret
  it("returns 500 if JWT_SECRET missing", async () => {
    delete process.env.JWT_SECRET; // Remove secret
    ctx.request.body = { email: "test@example.com", password: "password" };

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(500);
    expect(ctx.response.body.error).toBeDefined();
  });

  // Test unexpected DB error
  it("returns 500 on unexpected error", async () => {
    ctx.request.body = { email: "test@example.com", password: "password" };
    (
      strapi.db.query("api::student.student").findOne as jest.Mock
    ).mockImplementation(() => {
      throw new Error("DB Error");
    });

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(500);
    expect(ctx.response.body.error).toBeDefined();
  });
});
