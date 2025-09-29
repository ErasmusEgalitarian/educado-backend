import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env("BACKEND_URL");

describe("Admin page", () => {
  before(() => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/login`, {
      statusCode: 202,
      body: {
        userInfo: {
          id: "1",
          name: "Test User",
          email: "test@email.com",
          role: "admin",
        },
        token: "testToken",
      },
    });

    cy.intercept("GET", `${BACKEND_URL}/api/courses/creator/*`, {
      statusCode: 200,
      body: [],
    });
    cy.visit("http://localhost:3000/login");
    cy.get("#email-field").type("test@email.com");
    cy.get("#password-field").type("password");
    cy.get("#submit-login-button").click();
    cy.url().should("include", "/courses");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  it("shows empty field when there are no applications", () => {
    cy.intercept("GET", `${BACKEND_URL}/api/user-info`, {
      body: {
        status: 200,
        data: [],
        success: true,
      },
    });

    cy.visit("http://localhost:3000/educado-admin/applications");

    cy.contains("John").should("not.exist");
    cy.contains("Doe").should("not.exist");
    cy.contains("mail@gmail.com").should("not.exist");
  });

  it("shows a list of applicants", () => {
    cy.intercept("GET", `${BACKEND_URL}/api/user-info`, {
      body: {
        status: 200,
        data: [
          {
            firstName: "John",
            lastName: "Doe",
            email: "mail@gmail.com",
            role: "creator",
            approved: "true",
            rejected: "false",
          },
        ],
        success: true,
      },
    });

    cy.visit("http://localhost:3000/educado-admin/applications");

    cy.contains("John").should("exist");
    cy.contains("Doe").should("exist");
    cy.contains("mail@gmail.com").should("exist");
  });
  it("filters list of applicant based on search term", () => {
    cy.intercept("GET", `${BACKEND_URL}/api/user-info`, {
      body: {
        status: 200,
        data: [
          {
            firstName: "John",
            lastName: "Doe",
            email: "mail@gmail.com",
            role: "creator",
            approved: "true",
            rejected: "false",
          },
        ],
        success: true,
      },
    });

    cy.visit("http://localhost:3000/educado-admin/applications");
    cy.get("#search-term").type("John");
    cy.contains("Jane").should("not.exist");
  });
});

export {};
