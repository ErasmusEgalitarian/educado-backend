import React from "react";
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router-dom"; 
import { describe, it, expect } from '@jest/globals';
import Welcome from '../../../src/pages/Welcome';

jest.useFakeTimers();

describe("Welcome Component", () => {
  it("renders without errors", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
          <MemoryRouter>
            <Welcome />
          </MemoryRouter>
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
  });

  it("links to the /login route", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
    )});

    const entrarButton = component.root.findByProps({ to: "/login" });
    expect(entrarButton).toBeTruthy();
  });

  it("links to the /signup route", async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
    )});

    const entrarButton = component.root.findByProps({ to: "/signup" });
    expect(entrarButton).toBeTruthy();
  });
});