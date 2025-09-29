import "cypress-localstorage-commands";
import "cypress-file-upload";
const BACKEND_URL = Cypress.env("BACKEND_URL");

/**
 * Test the tool tips on the course page
 */
describe("Tooltip on Course Page", () => {
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

    cy.visit("http://localhost:3000/login");
    cy.get("#email-field").type("test@email.com");
    cy.get("#password-field").type("password");
    cy.get("#submit-login-button").click();
    cy.url().should("include", "/courses");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.intercept("GET", `${BACKEND_URL}/api/courses/*`, {
      statusCode: 200,
      body: {
        _id: 1,
        title: "Test Course",
        category: "sewing",
        coverImg: "",
        description: "This is a test course.",
        creator: "Test User",
        status: "published",
        estimatedHours: 0,
        rating: 1,
        difficulty: 1,
        numOfSubscriptions: 0,
        dateUpdated: Date.now(),
        dateCreated: Date.now(),
        sections: [],
        __v: 2,
      },
    });

    cy.restoreLocalStorage();
    cy.visit(`http://localhost:3000/courses/manager/1/0`);
  });

  it("Close tooltip", () => {
    cy.get("#tooltipIcon0").click();
    cy.get("#tooltipBox").should("exist");

    cy.get("#tooltipClose").click();
    cy.get("#tooltipBox").should("not.exist");
  });

  it("Cycle through tooltips", () => {
    cy.get("#tooltipIcon0").click();
    cy.get("#tooltipBox").should("exist");

    cy.get("#tooltipNext").click();
    cy.get("#tooltipBack").click();

    cy.get("#tooltipClose").click();
    cy.get("#tooltipBox").should("not.exist");
  });

  it("Finish tooltip", () => {
    cy.get("#tooltipIcon1").click();
    cy.get("#tooltipBox").should("exist");

    cy.get("#tooltipFinish").click();
    cy.get("#tooltipBox").should("not.exist");
  });
});

/**
 * Test the create course page
 */
describe("Create Course", () => {
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

    cy.visit("http://localhost:3000/login");
    cy.get("#email-field").type("test@email.com");
    cy.get("#password-field").type("password");
    cy.get("#submit-login-button").click();
    cy.url().should("include", "/courses");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.intercept("PUT", `${BACKEND_URL}/api/courses/`, {
      statusCode: 200,
      body: {
        status: "draft",
      },
    });

    cy.restoreLocalStorage();
    cy.visit(`http://localhost:3000/courses/manager/0/0`);
  });

  it("Create Course", () => {
    //check if title and description field is empty
    cy.get("#title-field").should("be.empty");
    cy.get("#description-field").should("be.empty");

    //fill in the different fields
    cy.get("#title-field").type("Test Course");
    cy.get("#description-field").type("This is a test course.");
    cy.get("#category-field").select("sewing");
    cy.get("#difficulty-field").select("1");

    //check if the fields are filled in
    cy.get("#title-field").should("have.value", "Test Course");
    cy.get("#description-field").should("have.value", "This is a test course.");
    cy.get("#category-field").should("have.value", "sewing");
    cy.get("#difficulty-field").should("have.value", "1");

    // Upload the cover image
    cy.fixture("mock-image.png").then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: "mock-image.png",
        mimeType: "image/png",
      });
    });

    //save the course
    cy.get("#SaveAsDraft").click();
  });
});

export {};
