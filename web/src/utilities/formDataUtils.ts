import { getUserInfo } from "@helpers/userInfo";
import { FormattedCourse } from "@interfaces/Course";

// Prepare form data for course creation or update
export const prepareFormData = (course: FormattedCourse): FormData => {
    const formData = new FormData();
    const { id: userId } = getUserInfo();


    // Append the entire course data (excluding files) to formData
    const courseData = { ...course, userId };
    formData.append("courseData", JSON.stringify(courseData));

    // Append cover image to formData if it exists
    if (course.courseInfo.coverImg) {
        formData.append("coverImg", course.courseInfo.coverImg.file);
    }

    // Append section data and any media files in the components, right now a max of 10 in the backend
    if (course.sections) {
        course.sections.forEach((section, sectionIndex) => {
            section.components.forEach((component, componentIndex) => {
                if (component.video) {
                    formData.append(`sections[${sectionIndex}].components[${componentIndex}].video`, component.video.file);
                }
            });
        });
    }

    return formData;
};

export const getCourseIdFromFormData = (formData: FormData): string => {
    const courseData = formData.get("courseData");
    const course = JSON.parse(courseData as string);
    return course.courseInfo._id;
}
