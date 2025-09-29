import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "@jest/globals";
import Login from "../../../src/pages/Login";

jest.useFakeTimers();

// jest.mock('../../../src/services/auth.services', () => ({
//     postUserLogin: jest.fn(async () => {
//         return mockedCourses; //not the right return
//     }),
// }));

jest.mock("../../../src/helpers/environment", () => ({
  BACKEND_URL: "http://localhost:8888",
  REFRESH_TOKEN_URL: "http://localhost:8888/auth/refresh/jwt",
}));

describe("Login Component", () => {
  it("can render login page without errors", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("can navigate to the welcome page and the signup pages", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );
    });

    const entrarButton = component.root.findAllByProps({ to: "/welcome" })[1];
    const submitButton = component.root.findByProps({ to: "/signup" });

    expect(entrarButton && submitButton).toBeTruthy();
  });

  //   it("can submit a correct HTTP request", async () => {
  //     let component;
  //     await renderer.act(async () => {
  //         component = renderer.create(
  //         <MemoryRouter>
  //             <Login />
  //         </MemoryRouter>
  //     )});

  //     const mockAxios = new MockAdapter(axios);

  //     mockAxios.onPost(`${BACKEND_URL}/api/credentials/login`).reply(202);

  //     const formData = {
  //         email: "mail@HotMail.com",
  //         password: "wordOfPass",
  //       };

  //     AuthServices.postUserLogin({ formData }); //Muck here

  //     expect(mockAxios.history.post.length).toBe(1);
  //   });
  it("can disable the submit button of the form is invalid", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );
    });

    const submitButton = component.root.findByProps({
      id: "submit-login-button",
    });
    expect(submitButton.props.disabled).toBe(true);
  });

  it("can hide or show password", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );
    });
    const passwordField = component.root.findByProps({ id: "password-field" });
    expect(passwordField.props.type).toBe("password");

    const hidePasswordButton = component.root.findByProps({
      id: "hidePasswordIcon",
    });
    await renderer.act(async () => {
      hidePasswordButton.props.onClick();
    });
    expect(passwordField.props.type).toBe("text");
  });
});
