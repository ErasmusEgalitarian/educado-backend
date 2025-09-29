import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { CourseProvider, useCourse, useSections, useLectures} from '@contexts/courseStore';
import { mockCourse, mockSection, mockLecture, mockLectureComponent, mockExercise, mockExerciseComponent } from './mockData';
import { useCombinedHooks } from './testHelperFunctions';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);

describe('useLecture', () => {
    it('should add lecture to cache', () => {
        const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
        act(() => {
          result.current.addLectureToCache(mockLecture);
        });
        expect(result.current.lectures).toContainEqual(mockLecture);
      });
    
      it('should get cached lecture', () => {
        const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
        act(() => {
          result.current.addLectureToCache(mockLecture);
        });
        const lecture = result.current.getCachedLecture('1');
        expect(lecture).toEqual(mockLecture);
      });

      it('should get null when lecture is not in cache', () => {
        const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
        const lecture = result.current.getCachedLecture('1');
        expect(lecture).toBeNull();
      });
    
      it('should update cached lecture', () => {
        const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
        act(() => {
          result.current.addLectureToCache(mockLecture);
          result.current.updateCachedLecture({ ...mockLecture, title: 'Updated Lecture' });
        });
        const lecture = result.current.getCachedLecture('1');
        expect(lecture?.title).toBe('Updated Lecture');
      });
    
});