import {
  Course,
  Section,
  Component,
  Lecture,
  Exercise,
  Media,
  FormattedCourse,
} from "../types/Course";

export const formatCourse = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
): FormattedCourse => {
  const courseInfo = formatCourseInfo(course, media);
  const formattedSections = formatSections(
    course,
    sections,
    lectures,
    exercises,
    media
  );
  return { courseInfo, sections: formattedSections };
};

const formatCourseInfo = (course: Course, media: Media[]) => {
  const coverIMG =
    media.find(
      (media) => media.parentType === "c" && media.id === course._id
    ) || null;
  return {
    _id: course._id ?? "",
    title: course.title,
    category: course.category,
    difficulty: course.difficulty,
    description: course.description,
    coverImg: coverIMG,
    status: course.status,
    creator: course.creator ?? "",
  };
};

const formatSections = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
) => {
  if (course.sections.length === 0) return [];
  let haventCachedSections = false;
  const formattedSections = course.sections.map((sectionId) => {
    const section = sections.find((sec) => sec._id === sectionId);
    if (!section) {
      haventCachedSections = true;
      return { _id: "", title: "", description: "", components: [] };
    }

    return {
      _id: section._id,
      title: section.title,
      description: section.description,
      components: formatComponents(
        section.components,
        lectures,
        exercises,
        media
      ),
    };
  });
  // This is in case that the sectionspage hasn't been accessed yet and courseInfo changes are tried to be made, then the sections are not cached yet.
  return haventCachedSections ? null : formattedSections;
};

const formatComponents = (
  components: Component[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
) => {
  return components
    .map((component) => {
      const isLecture = component.compType === "lecture";
      const comp = isLecture
        ? lectures.find((lecture) => lecture._id === component.compId)
        : exercises.find((exercise) => exercise._id === component.compId);
      return comp
        ? {
            compType: component.compType,
            component: comp,
            video: isLecture ? lookForMedia(media, comp._id) : null,
          }
        : null;
    })
    .filter((comp) => comp !== null) as {
    compType: string;
    component: Lecture | Exercise;
    video: Media | null;
  }[];
};

const lookForMedia = (media: Media[], lookupId: string): Media | null => {
  const foundMedia = media.find((media) => media.id === lookupId);
  return foundMedia ? foundMedia : null;
};
