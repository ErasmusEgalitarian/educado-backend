import loginController from "../../src/api/student-auth/controllers/student-login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock external libraries to avoid real hashing or token generation
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Define a variable to hold the mock for the student document service,
// so we can access its methods (like findFirst) across tests.
let studentDocumentServiceMock: any;

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
      // Ensure 'verifiedAt' is present and can be converted to a Date
      verifiedAt: new Date().toISOString(),
      isVerified: true,
    };

    // Mock request and response objects for each test
    ctx = {
      // Will be set per test
      request: { body: {} },
      // Default initial status is 0, which is why the test was failing
      response: { status: 0, body: null },
    };

    // Provide a JWT secret for token generation
    process.env.JWT_SECRET = "secretkey";

    // Defining the mock object that represents the return value of strapi.documents('...')
    studentDocumentServiceMock = {
      // This is the one used for finding the user in loginAction
      findFirst: jest.fn(),
      // This is used for logging in createUserLog
      create: jest.fn().mockResolvedValue({}),
      // Other methods used in the controller for completeness
      findMany: jest.fn(),
      delete: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      publish: jest.fn().mockResolvedValue({}),
    };

    // Mockoing the global strapi object
    (global as any).strapi = {
      // Mock the documents function to return the service mock object
      documents: jest.fn((apiName) => {
        // Return the same mock service for all documents used
        return studentDocumentServiceMock;
      }),
      // Mock logger
      log: { error: jest.fn() },
      // The old strapi.db mock has been removed to prevent conflicts
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

    // MOCK: findFirst returns null
    studentDocumentServiceMock.findFirst.mockResolvedValue(null);

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  // Test invalid password
  it("returns 400 if password is invalid", async () => {
    ctx.request.body = { email: "test@example.com", password: "wrongpass" };

    // MOCK: findFirst returns the mockUser
    studentDocumentServiceMock.findFirst.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password comparison fails

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
    // Verify that the log was called
    expect(studentDocumentServiceMock.create).toHaveBeenCalled();
  });

  // Test successful login
  it("returns JWT token on successful login", async () => {
    ctx.request.body = { email: "test@example.com", password: "password" };

    // MOCK: findFirst returns the mockUser
    studentDocumentServiceMock.findFirst.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password comparison succeeds
    (jwt.sign as jest.Mock).mockReturnValue("mockedtoken");

    await loginController.loginAction(ctx, null);

    // This assertion will now pass, provided you added `ctx.response.status = 200;` to your controller.
    expect(ctx.response.status).toBe(200);
    expect(ctx.response.body).toBe(JSON.stringify("mockedtoken"));
    // Verify that the JWT was signed
    expect(jwt.sign).toHaveBeenCalled();
    // Verify that the log was called
    expect(studentDocumentServiceMock.create).toHaveBeenCalled();
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

    // MOCK: findFirst to throw an error
    studentDocumentServiceMock.findFirst.mockRejectedValue(
      new Error("DB Error")
    );

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(500);
    expect(ctx.response.body.error).toBeDefined();
    // Check that the error was logged
    expect(strapi.log.error).toHaveBeenCalled();
  });
});
