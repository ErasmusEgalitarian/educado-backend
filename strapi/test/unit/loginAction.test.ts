let todoController = require("../../src/api/login/controllers/login");

describe("Todo Controller", () => {
  let strapi: { plugin: any };
  let createMock: jest.Mock;
  let completeMock: jest.Mock;

  beforeEach(async function () {
    // Create mock functions that we can reference later
    createMock = jest.fn().mockReturnValue({
      data: {
        name: "test",
        status: false,
      },
    });

    completeMock = jest.fn().mockReturnValue({
      data: {
        id: 1,
        status: true,
      },
    });

    // Mock the strapi object
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn((serviceName) => {
          if (serviceName === "create") {
            return { create: createMock };
          }
          if (serviceName === "complete") {
            return { complete: completeMock };
          }
        }),
      }),
    };
  });

  it("should create a todo", async function () {
    const ctx = {
      request: {
        body: {
          name: "test",
        },
      },
      body: null,
    };

    await todoController({ strapi }).index(ctx);

    expect(ctx.body).toBe("created");
    // Now assert on the stored mock reference
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("should complete a todo", async function () {
    const ctx = {
      request: {
        body: {
          id: 1,
        },
      },
      body: null,
    };

    await todoController({ strapi }).complete(ctx);

    expect(ctx.body).toBe("todo completed");
    // Assert on the stored mock reference
    expect(completeMock).toHaveBeenCalledTimes(1);
  });
});
