import verifyController from "../../src/api/student-auth/controllers/student-registration";
import jwt from "jsonwebtoken";

// Mock JWT
jest.mock("jsonwebtoken");

// Mock Strapi documents for DB operations
describe("verifyAction controller", () => {
  let ctx: any;
  let mockToken: any;
  let mockUser: any;

  // Mocked Koa/Strapi context
  beforeEach(() => {
    ctx = {
      request: { body: {} },
      response: { status: 0, body: null },
    };

    mockToken = {
      token: "123456",
      expiresAt: new Date(Date.now() + 10000).toISOString(), // future expiry
      userEmail: "test@example.com",
    };

    mockUser = {
      documentId: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      verifiedAt: null,
    };

    (global as any).strapi = {
      documents: jest.fn(),
      log: { error: jest.fn() },
    };
  });

  it("returns 400 if token not found", async () => {
    ctx.request.body = { email: "test@example.com", tokenCode: "123456" };

    (strapi.documents as unknown as jest.Mock).mockImplementation(
      (collection: string) => {
        if (collection === "api::verification-token.verification-token") {
          return { findFirst: jest.fn().mockResolvedValue(null) };
        }
        return {};
      }
    );

    await verifyController.verifyAction(ctx, null);
    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  it("returns 400 if user not found", async () => {
    ctx.request.body = { email: "test@example.com", tokenCode: "123456" };

    (strapi.documents as unknown as jest.Mock).mockImplementation(
      (collection: string) => {
        if (collection === "api::verification-token.verification-token") {
          return { findFirst: jest.fn().mockResolvedValue(mockToken) };
        }
        if (collection === "api::student.student") {
          return { findFirst: jest.fn().mockResolvedValue(null) };
        }
        return {};
      }
    );

    await verifyController.verifyAction(ctx, null);
    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });

  it("returns signed JWT on successful verification", async () => {
    ctx.request.body = { email: "test@example.com", tokenCode: "123456" };

    (strapi.documents as unknown as jest.Mock).mockImplementation(
      (collection: string) => {
        if (collection === "api::verification-token.verification-token") {
          return { findFirst: jest.fn().mockResolvedValue(mockToken) };
        }
        if (collection === "api::student.student") {
          return {
            findFirst: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue({}),
            publish: jest.fn().mockResolvedValue({
              documentId: mockUser.documentId,
              entries: [mockUser],
            }),
          };
        }
        return {};
      }
    );

    (jwt.sign as jest.Mock).mockReturnValue("mockedJWT");

    await verifyController.verifyAction(ctx, null);

    expect(ctx.response.status).toBe(0); // default success, no error
    expect(ctx.response.body).toBe(JSON.stringify("mockedJWT"));
  });

  it("returns error if unexpected exception occurs", async () => {
    ctx.request.body = { email: "test@example.com", tokenCode: "123456" };

    (strapi.documents as unknown as jest.Mock).mockImplementation(
      (collection: string) => {
        if (collection === "api::verification-token.verification-token") {
          return { findFirst: jest.fn().mockResolvedValue(mockToken) };
        }
        if (collection === "api::student.student") {
          return {
            findFirst: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockImplementation(() => {
              throw new Error("DB Error");
            }),
            publish: jest.fn(),
          };
        }
        return {};
      }
    );

    await verifyController.verifyAction(ctx, null);
    expect(ctx.response.body.error).toBeDefined();
  });

  it("returns 400 if email or tokenCode missing or wrong type", async () => {
    ctx.request.body = { email: 123, tokenCode: true };

    await verifyController.verifyAction(ctx, null);
    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body.error).toBeDefined();
  });
});
