import React from "react";
import TestRenderer from "react-test-renderer";
import PersonalInsights from "../../../../src/components/Courses/PersonalInsights";
import { generateTestCourse } from "../../../../__testUtils__/courses/courseTestUtils";

let courseList;

// Mock services
jest.mock("../../../../src/services/contentCreator.services", () => ({
  getAverageRatingOfCC: jest.fn(() => Promise.resolve(4.5)),
}));

// Mock user info
jest.mock("../../../../src/helpers/userInfo", () => ({
  getUserInfo: jest.fn(() => ({
    id: 1,
    name: "Test User",
    email: "",
  })),
}));

beforeAll(() => {
  // Generate two fake courses
  const course = generateTestCourse();
  course.numOfSubscriptions = 100;
  course.rating = 3;
  const course1 = generateTestCourse();
  course1.numOfSubscriptions = 200;
  course1.rating = 4;

  // Add courses to an array
  courseList = [course, course1];
});

it("matches snapshot for courses", () => {
  const testRenderer = TestRenderer.create(
    <PersonalInsights courses={courseList} />,
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("matches snapshot without courses", () => {
  const testRenderer = TestRenderer.create(<PersonalInsights courses={[]} />);
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
