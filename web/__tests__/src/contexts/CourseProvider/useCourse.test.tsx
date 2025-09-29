import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { CourseProvider, useCourse } from "@contexts/courseStore";
import { mockCourse } from "./mockData";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);

describe("useCourse", () => {
  it("should update course", () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCourse(mockCourse);
    });
    expect(result.current.course).toEqual(mockCourse);
  });

  it("should update course field", () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCourseField({ title: "Updated Title" });
    });
  });

  it("should updateCachedCourseSections properly", () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCachedCourseSections(["2", "1"]);
    });
    expect(result.current.course.sections).toEqual(["2", "1"]);
  });

  it("should handle empty sections array", () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCachedCourseSections(["2", "1"]);
    });
    act(() => {
      result.current.updateCachedCourseSections([]);
    });
    expect(result.current.course.sections).toEqual([]);
  });

  it("should handle null sections array", () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCachedCourseSections(["2", "1"]);
    });
    act(() => {
      result.current.updateCachedCourseSections(null as unknown as string[]);
    });
    expect(result.current.course.sections).toEqual([]);
  });
});
