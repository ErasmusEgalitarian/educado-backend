/**
 * Course Sections Seeder
 *
 * Seeds initial course sections (course-selection) into the database.
 * Links sections to their parent courses.
 */

import type { Core } from "@strapi/strapi";

// Define your course sections here
interface CourseSectionSeed {
    title: string;
    description: string;
    courseName: string; // Name of the parent course
}

const courseSections: CourseSectionSeed[] = [
    // Introduction to Programming sections
    {
        title: "Getting Started",
        description:
            "Set up your development environment and write your first program.",
        courseName: "Introduction to Programming",
    },
    {
        title: "Variables and Data Types",
        description:
            "Learn about different data types and how to store values in variables.",
        courseName: "Introduction to Programming",
    },
    {
        title: "Control Flow",
        description:
            "Master conditionals and loops to control the flow of your programs.",
        courseName: "Introduction to Programming",
    },
    {
        title: "Functions",
        description: "Learn how to create reusable code blocks with functions.",
        courseName: "Introduction to Programming",
    },

    // Web Development Fundamentals sections
    {
        title: "HTML Basics",
        description:
            "Learn the structure of web pages using HTML elements and attributes.",
        courseName: "Web Development Fundamentals",
    },
    {
        title: "Styling with CSS",
        description:
            "Make your websites beautiful with CSS styling and layouts.",
        courseName: "Web Development Fundamentals",
    },
    {
        title: "JavaScript Essentials",
        description:
            "Add interactivity to your websites with JavaScript.",
        courseName: "Web Development Fundamentals",
    },
    {
        title: "Responsive Design",
        description:
            "Build websites that look great on all devices.",
        courseName: "Web Development Fundamentals",
    },

    // Advanced React Patterns sections
    {
        title: "Custom Hooks",
        description:
            "Create reusable logic with custom React hooks.",
        courseName: "Advanced React Patterns",
    },
    {
        title: "Context and State Management",
        description:
            "Manage global state effectively in React applications.",
        courseName: "Advanced React Patterns",
    },
    {
        title: "Render Props and HOCs",
        description:
            "Advanced patterns for component composition and code reuse.",
        courseName: "Advanced React Patterns",
    },
];

export default async function seedCourseSections(
    strapi: Core.Strapi
): Promise<void> {
    // Get all courses for linking
    const allCourses = await strapi.documents("api::course.course").findMany({
        fields: ["id", "title"],
    });

    const courseMap = new Map(allCourses.map((c) => [c.title, c.documentId]));

    // Get existing sections to avoid duplicates
    const existingSections = await strapi
        .documents("api::course-selection.course-selection")
        .findMany({
            fields: ["title"],
            populate: ["course"],
        });

    // Create a set of "title:courseId" to check for duplicates
    const existingKeys = new Set(
        existingSections.map((s) => `${s.title}:${(s.course as any)?.documentId || ""}`)
    );

    let createdCount = 0;

    for (const section of courseSections) {
        const courseId = courseMap.get(section.courseName);

        if (!courseId) {
            strapi.log.warn(
                `    Course "${section.courseName}" not found, skipping section "${section.title}"`
            );
            continue;
        }

        const key = `${section.title}:${courseId}`;
        if (existingKeys.has(key)) {
            continue; // Skip if section already exists for this course
        }

        const created = await strapi.documents("api::course-selection.course-selection").create({
            data: {
                title: section.title,
                description: section.description,
                course: courseId,
            },
        });
        // Publish the created document
        await strapi.documents("api::course-selection.course-selection").publish({
            documentId: created.documentId,
        });

        createdCount++;
    }

    if (createdCount === 0) {
        strapi.log.debug("    All course sections already exist, skipping...");
    } else {
        strapi.log.debug(`    Created ${createdCount} new course sections`);
    }
}
