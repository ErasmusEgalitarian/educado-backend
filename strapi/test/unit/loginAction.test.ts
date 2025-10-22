import loginController from "../../src/api/login/controllers/login";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("loginAction controller", () => {
  let ctx: any;
  let mockUser: any;

  beforeEach(() => {
    mockUser = {
      documentId: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      isVerified: true,
    };

    ctx = {
      request: { body: {} },
      response: { status: 0, body: null },
    };

    process.env.JWT_SECRET = "secretkey";

    // Mock Strapi DB query
    (global as any).strapi = {
      db: {
        query: jest.fn().mockReturnValue({
          findOne: jest.fn(),
        }),
      },
      log: { error: jest.fn() },
      documents: jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue({}),
      }),
    };
  });

  it("returns 400 if email or password missing", async () => {
    ctx.request.body = {};
    await loginController.loginAction(ctx, null);
    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  it("returns 400 if user not found", async () => {
    ctx.request.body = { email: "notfound@example.com", password: "123" };
    (
      strapi.db.query("api::student.student").findOne as jest.Mock
    ).mockResolvedValue(null);

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

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

  it("returns 500 if JWT_SECRET missing", async () => {
    delete process.env.JWT_SECRET;
    ctx.request.body = { email: "test@example.com", password: "password" };

    await loginController.loginAction(ctx, null);

    expect(ctx.response.status).toBe(500);
    expect(ctx.response.body.error).toBeDefined();
  });

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
