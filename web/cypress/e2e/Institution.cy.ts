import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env("BACKEND_URL");

describe("Application overview page", () => {
  before(() => {
    // Intercept the login request and include the admin role
    cy.intercept("POST", `${BACKEND_URL}/api/auth/login`, {
      statusCode: 202,
      body: {
        userInfo: {
          id: "1",
          name: "Test User",
          email: "test@email.com",
          role: "admin", // Adding admin role here
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

  it("can upload new institution", () => {
    // Re-intercept the login request with admin role
    cy.intercept("POST", `${BACKEND_URL}/api/auth/login`, {
      statusCode: 202,
      body: {
        userInfo: {
          id: "1",
          name: "Test User",
          email: "test@email.com",
          role: "admin", // Ensure the role is set to admin
        },
        token: "testToken",
      },
    });

    // Intercept necessary requests for the Institutions page
    cy.intercept("GET", `${BACKEND_URL}/api/institutions`, {
      statusCode: 200,
      body: [], // Adjust body as per response data structure
    }).as("getInstitutions");

    // Intercept GET requests to /api/users/* with an Authorization header
    cy.intercept("GET", `${BACKEND_URL}/api/users/*`, (req) => {
      req.headers["Authorization"] = `Bearer testToken`; // Set the auth header with the token
      req.reply({
        statusCode: 200,
        body: {
          /* Add necessary user data here if needed */
        },
      });
    }).as("getUsers");

    // Intercept the institution creation request
    cy.intercept("POST", `${BACKEND_URL}/api/applications/newinstitution`, {
      statusCode: 201,
      body: {
        institution: {
          secondaryDomain: "@role.instutition.dom",
          domain: "@institution.dom",
          institutionName: "MyInstitution",
        },
      },
    }).as("createInstitution");

    // Visit the main admin page
    cy.visit("http://localhost:3000/educado-admin");

    // Click on Institutions button and wait for the page to load
    cy.get("#InstitutionsButton").click();
    cy.wait("@getInstitutions"); // Wait for the institutions data to load

    // Click the button to open the modal for adding a new institution
    cy.get("#newInstitutionButton").click();

    // Fill out and submit the new institution form
    cy.get("#institution").type("MyInstitution");
    cy.get("#domain").type("@institution.dom");
    cy.get("#secondary-domain").type("@role.institution.dom");
    cy.get("#confirm-button").click();

    cy.url().should("not.include", "/newinstitution"); // Ensure the modal closed or redirected as expected
  });
});

export {};
