import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env("BACKEND_URL");

describe("Application overview page", () => {
  before(() => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/login`, {
      statusCode: 202,
      body: {
        userInfo: {
          id: "1",
          name: "Test User",
          email: "test@email.com",
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

  it("navigates back to Admin page if application is not found ", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    const id = 1;
    cy.intercept("GET", `${BACKEND_URL}/api/applications`, {
      body: {
        status: 200,
        data: [{ firstName: "John", lastName: "Doe", email: "mail@gmail.com" }],
        success: true,
      },
    });

    cy.visit(`http://localhost:3000/educado-admin/applications/${id}`);

    cy.intercept("GET", `${BACKEND_URL}/api/applications/${id}`, {
      body: {
        data: [],
      },
    });
    cy.url().should("not.include", "/1");
  });

  it("shows applications correctly ", () => {
    const id = 1;
    cy.intercept("GET", `${BACKEND_URL}/api/applications`, {
      body: {
        status: 200,
        data: [{ firstName: "John", lastName: "Doe", email: "mail@gmail.com" }],
        success: true,
      },
    });

    cy.visit(`http://localhost:3000/educado-admin/applications/${id}`);

    cy.intercept("GET", `${BACKEND_URL}/api/applications/${id}`, {
      body: {
        application: {
          motivation: "My Motivation",
          academicLevel: "Médio",
          academicStatus: "Concluída",
          major: "Computer Science",
          institution: "AAU",
          educationStartDate: "8/21",
          educationEndDate: "6/23",
          company: "MyCompany",
          position: "Professional Uptight Co-worker",
          workStartDate: "03/04",
          workEndDate: "09/11",
          workActivities: "I made, did, and published the thing",
          baseUser: 1,
        },
        applicator: {
          firstName: "John",
          lastName: "Doe",
          email: "mail@gmail.com",
        },
      },
    });
    cy.get("#reject-button").should("exist");
    cy.get("#approve-button").should("exist");
  });

  it("should be able to approve or reject application ", () => {
    const id = 1;
    cy.intercept("GET", `${BACKEND_URL}/api/applications`, {
      body: {
        status: 200,
        data: [{ firstName: "John", lastName: "Doe", email: "mail@gmail.com" }],
        success: true,
      },
    });

    cy.visit(`http://localhost:3000/educado-admin/applications/${id}`);

    cy.intercept("GET", `${BACKEND_URL}/api/applications/${id}`, {
      body: {
        application: {
          motivation: "My Motivation",
          academicLevel: "Médio",
          academicStatus: "Concluída",
          major: "Computer Science",
          institution: "AAU",
          educationStartDate: "8/21",
          educationEndDate: "6/23",
          company: "MyCompany",
          position: "Professional Uptight Co-worker",
          workStartDate: "03/04",
          workEndDate: "09/11",
          workActivities: "I made, did, and published the thing",
          baseUser: 1,
        },
        applicator: {
          firstName: "John",
          lastName: "Doe",
          email: "mail@gmail.com",
        },
      },
    });

    cy.intercept("PUT", `${BACKEND_URL}/api/applications/${id}approve`, {
      body: {},
    });
    cy.intercept("PUT", `${BACKEND_URL}/api/applications/${id}approve`, {
      body: {},
    });
  });
});

export {};
