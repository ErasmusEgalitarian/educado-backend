const BACKEND_URL = Cypress.env("BACKEND_URL");

describe("Password recovery modal", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("gives a success message upon correct information in all steps", () => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password*`, {});
    cy.intercept("PATCH", `${BACKEND_URL}/api/auth/reset-password`, {});

    cy.location("pathname").should("eq", "/login");
    cy.get("#modalToggle").click();

    cy.get("#reset-password-email-field").type("test@email.com");

    cy.get("#error-message").should("not.exist");

    const continueButton = cy.get("#continue");
    continueButton.click();

    cy.get("#pin-field").type("1234");
    continueButton.click();
    const passwordField = cy.get("#reset-password-password-field");
    passwordField.type("password");

    // Clicking the eye icon should change the password field to text
    cy.get("#reset-password-password-eye").click();
    cy.get("#reset-password-password-field").should(
      "have.attr",
      "type",
      "email",
    );

    // Clicking the eye icon again should change the password field back to password
    cy.get("#reset-password-password-eye").click();
    cy.get("#reset-password-password-field").should(
      "have.attr",
      "type",
      "password",
    );

    cy.get("#confirm-password-field").type("password");
    continueButton.click();
    cy.get("#error-message").should("not.have.text", "");
  });

  it("closes the modal when clicking cancel button", () => {
    cy.get("#modalToggle").click();
    cy.get("#password-reset-modal").should("exist");
    cy.get("#cancel-button").click();
    cy.get("#password-reset-modal").should("not.exist");
  });

  it("shows an error message when email is invalid", () => {
    cy.get("#modalToggle").click();
    cy.get("#reset-password-email-field").type("invalid-email");
    cy.get("#continue").click();
    cy.get("#email-error").should("have.text", "Email inválido");
  });

  it("shows an error message when email is not registered", () => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-request`, {
      statusCode: 400,
      body: {
        error: {
          code: "E0401",
        },
      },
    });
    cy.get("#modalToggle").click();
    cy.get("#reset-password-email-field").type("test@test.com");
    cy.get("#continue").click();
    cy.get("#email-error").should("have.text", "Email não cadastrado");
  });

  it("shows an error message when pin is invalid", () => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-request`, {});
    // Intercept POST request to /api/auth/reset-password-request and return a 400 error
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-code`, {
      statusCode: 400,
      body: {
        error: {
          code: "E0405",
        },
      },
    });

    cy.get("#modalToggle").click();
    cy.get("#reset-password-email-field").type("test@test.com");
    cy.get("#continue").click();
    cy.get("#pin-field").type("4215");
    cy.get("#continue").click();
    cy.get("#pin-error").should("have.text", "Código inválido");
  });

  it("shows an error message when password is invalid", () => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-request`, {});
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-code`, {});
    cy.intercept("PATCH", `${BACKEND_URL}/api/auth/reset-password`, {
      statusCode: 400,
      body: {
        error: {
          code: "E0406",
        },
      },
    });

    cy.get("#modalToggle").click();
    cy.get("#reset-password-email-field").type("test@test.com");
    cy.get("#continue").click();
    cy.get("#pin-field").type("1234");
    cy.get("#continue").click();
    cy.get("#reset-password-password-field").type("passwod");
    cy.get("#confirm-password-field").type("passwod");
    cy.get("#continue").click();
    cy.get("#password-error").should(
      "have.text",
      "A senha precisa ter no mínimo 8 caracteres",
    );
  });

  it("shows an error message when password and confirm password do not match", () => {
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-request`, {});
    cy.intercept("POST", `${BACKEND_URL}/api/auth/reset-password-code`, {});
    cy.intercept("PATCH", `${BACKEND_URL}/api/auth/reset-password`, {
      statusCode: 400,
      body: {
        error: {
          code: "E0406",
        },
      },
    });

    cy.get("#modalToggle").click();
    cy.get("#reset-password-email-field").type("test@test.com");
    cy.get("#continue").click();
    cy.get("#pin-field").type("1234");
    cy.get("#continue").click();
    cy.get("#reset-password-password-field").type("password");
    cy.get("#confirm-password-field").type("password1");
    cy.get("#continue").click();
    cy.get("#password-confirmation-error").should(
      "have.text",
      "Os campos de senha precisam ser iguais",
    );
  });
});

export {};
