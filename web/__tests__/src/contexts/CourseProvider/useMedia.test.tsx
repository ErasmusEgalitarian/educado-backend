import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  CourseProvider,
  useCourse,
  useSections,
  useLectures,
  useMedia,
} from "@/course/context/courseStore";
import { mockMedia } from "./mockData";
import { useCombinedHooks } from "./testHelperFunctions";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);

describe("useMedia", () => {
  it("should add media to cache", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    expect(result.current.media).toContainEqual(mockMedia);
  });

  it("should get media", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    const mediaFile = result.current.getMedia("0");
    expect(mediaFile).toEqual(mockMedia.file);
  });

  it("should get null when media is not in cache", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    const mediaFile = result.current.getMedia("0");
    expect(mediaFile).toBeNull();
  });

  it("should update media", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    act(() => {
      result.current.updateMedia({
        id: mockMedia.id,
        file: new File([""], "updated.mp4", { type: "video/mp4" }),
        parentType: "c",
      });
    });

    const mediaFile = result.current.getMedia(mockMedia.id);
    expect(mediaFile?.name).toBe("updated.mp4");
  });

  it("should return null when updating non-existent media", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    const mediaFile = result.current.updateMedia(mockMedia);
    expect(mediaFile).toBeNull();
  });

  it("should delete media", () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
      result.current.deleteMedia("0");
    });
    const mediaFile = result.current.getMedia("0");
    expect(mediaFile).toBeNull();
  });
});
