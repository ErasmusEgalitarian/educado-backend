// import commands from "cypress"
import React from "react";
import Profile from "../../src/features/user/components/profile";
//import commands from './s'
import { BrowserRouter as Router } from "react-router-dom";

it("First Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".first_form_open").click({ force: true });
  cy.get('input[name="UserName"]').type("john doe");
  cy.get('input[name="UserEmail"]').type("john.doe@example.com");
  cy.get('input[name="linkedin"]').type("https://www.linkedin.com/in/johndoe/");
  cy.get('textarea[name="bio"]').type("this is bio");

  // Submit the form
  cy.get("form").submit();

  cy.get(".user_name_error").should("not.exist");
  cy.get(".user_email_error").should("not.exist");
  cy.get(".user_linkedin_error").should("not.exist");
});
/* it("First Form Should give error on user_name field if its empty", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>
  );
  // Fill in the form fields with valid data
  cy.get('.first_form_open').click({force: true});
  cy.get('input[name="userName"]')
  cy.get('input[name="userEmail"]').type('john.doe@example.com');
  cy.get('input[name="linkedin"]').type('https://www.linkedin.com/in/johndoe/');
  cy.get('textarea[name="bio"]').type('this is bio');

  // Submit the form
  cy.get('form').submit();
  cy.get('.user_name_error').should('exist').contains('This field is required!');
  cy.get('.user_email_error').should('not.exist');
  cy.get('.user_linkedin_error').should('not.exist');
}); */
it("First Form Should give error on user_email field if its not email", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".first_form_open").click({ force: true });
  cy.get('input[name="UserName"]').type("john doe");
  cy.get('input[name="UserEmail"]').type("john.doeexample.com");
  cy.get('input[name="linkedin"]').type("https://www.linkedin.com/in/johndoe/");
  cy.get('textarea[name="bio"]').type("this is bio");

  // Submit the form
  cy.get("form").submit();
  cy.get(".user_name_error").should("not.exist");
  cy.get(".user_email_error")
    .should("exist")
    .contains("You need a suitable email to submit");
  cy.get(".user_linkedin_error").should("not.exist");
});
it("First Form Should give error on linkedin field if its not linkedin url", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".first_form_open").click({ force: true });
  cy.get('input[name="UserName"]').type("john doe");
  cy.get('input[name="UserEmail"]').type("john.doe@example.com");
  cy.get('input[name="linkedin"]').type("johndoe");
  cy.get('textarea[name="bio"]').type("this is bio");

  // Submit the form
  cy.get("form").submit();
  cy.get(".user_name_error").should("not.exist");
  cy.get(".user_email_error").should("not.exist");
  cy.get(".user_linkedin_error")
    .should("exist")
    .contains("Invalid LinkedIn URL");
});

it("Second Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".second_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("12/12");
  cy.get('input[name="endDate"]').type("12/12");

  // Submit the form
  cy.get(".education_add_button").click();

  cy.get(".experience-startDate.p-3.mt-2").should("not.exist");
  cy.get(".education-endDate.p-3.mt-2").should("not.exist");
});
it("Second Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".second_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("1212");
  cy.get('input[name="endDate"]').type("12/12");

  // Submit the form
  cy.get(".education_add_button").click();

  cy.get(".education-startDate.p-3.mt-2").should("exist");
  cy.get(".education-endDate.p-3.mt-2").should("not.exist");
});
it("Second Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".second_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("12/12");
  cy.get('input[name="endDate"]').type("1212");

  // Submit the form
  cy.get(".education_add_button").click();

  cy.get(".education-startDate.p-3.mt-2").should("not.exist");
  cy.get(".education-endDate.p-3.mt-2").should("exist");
});

it("Third Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".third_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("12/12");
  cy.get('input[name="endDate"]').type("12/12");

  // Submit the form
  cy.get(".third_form_add").click();

  cy.get(".experience-startDate.p-3.mt-2").should("not.exist");
  cy.get(".experience-endDate.p-3.mt-2").should("not.exist");
});
it("Third Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".third_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("1212");
  cy.get('input[name="endDate"]').type("12/12");

  // Submit the form
  cy.get(".third_form_add").click();

  cy.get(".experience-startDate.p-3.mt-2").should("exist");
  cy.get(".experience-endDate.p-3.mt-2").should("not.exist");
});
it("Third Form Should not give error if all fields are valid", () => {
  // Mount the component again for each test case
  cy.mount(
    <Router>
      <Profile />
    </Router>,
  );
  // Fill in the form fields with valid data
  cy.get(".third_form_open").click({ force: true });
  cy.get('input[name="startDate"]').type("12/12");
  cy.get('input[name="endDate"]').type("1212");

  // Submit the form
  cy.get(".third_form_add").click();

  cy.get(".experience-startDate.p-3.mt-2").should("not.exist");
  cy.get(".experience-endDate.p-3.mt-2").should("exist");
});
