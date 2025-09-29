import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  CourseProvider,
  useCourse,
  useSections,
  useLectures,
  useExercises,
} from "@contexts/courseStore";
import {
  mockCourse,
  mockSection,
  mockLecture,
  mockLectureComponent,
  mockExercise,
  mockExerciseComponent,
} from "./mockData";
import { useCombinedHooks } from "./testHelperFunctions";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);

describe("useExercise", () => {
  it("should add exercise to cache", () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
    });
    expect(result.current.exercises).toContainEqual(mockExercise);
  });

  it("should get cached exercise", () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
    });
    const exercise = result.current.getCachedExercise("1");
    expect(exercise).toEqual(mockExercise);
  });

  it("should get null when exercise is not in cache", () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    const exercise = result.current.getCachedExercise("1");
    expect(exercise).toBeNull();
  });

  it("should update cached exercise", () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
      result.current.updateCachedExercise({
        ...mockExercise,
        title: "Updated Exercise",
      });
    });
    const exercise = result.current.getCachedExercise("1");
    expect(exercise?.title).toBe("Updated Exercise");
  });
});
