/**
 * Courses Seeder
 *
 * Seeds initial courses into the database.
 * Optionally links courses to categories and can handle image uploads.
 */

import type { Core } from "@strapi/strapi";
import path from "path";
import fs from "fs";

// Define your courses here
interface CourseSeed {
    title: string;
    description: string;
    difficulty: 1 | 2 | 3; // 1 = Beginner, 2 = Intermediate, 3 = Advanced
    durationHours: number;
    categories?: string[]; // Category names to link
    imagePath?: string; // Relative path from seed-assets folder
}

const courses: CourseSeed[] = [
    {
        title: "Introduction to Programming",
        description:
            "Learn the fundamentals of programming with hands-on examples. This course covers basic concepts like variables, loops, conditionals, and functions.",
        difficulty: 1,
        durationHours: 10,
        categories: ["Programming"],
        // imagePath: 'intro-programming.jpg',
    },
    {
        title: "Web Development Fundamentals",
        description:
            "Master HTML, CSS, and JavaScript to build modern websites. Learn responsive design principles and best practices for web development.",
        difficulty: 1,
        durationHours: 15,
        categories: ["Web Development", "Programming"],
        // imagePath: 'web-dev.jpg',
    },
    {
        title: "Advanced React Patterns",
        description:
            "Deep dive into advanced React patterns including hooks, context, render props, and compound components. Build scalable React applications.",
        difficulty: 3,
        durationHours: 20,
        categories: ["Web Development", "Programming"],
    },
    {
        title: "Data Science with Python",
        description:
            "Learn data analysis, visualization, and machine learning with Python. Work with pandas, numpy, matplotlib, and scikit-learn.",
        difficulty: 2,
        durationHours: 25,
        categories: ["Data Science", "Programming"],
    },
    {
        title: "Mobile App Development",
        description:
            "Build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase.",
        difficulty: 2,
        durationHours: 18,
        categories: ["Mobile Development", "Programming"],
    },
    {
        title: "DevOps Essentials",
        description:
            "Master CI/CD pipelines, containerization with Docker, and orchestration with Kubernetes. Learn infrastructure as code principles.",
        difficulty: 2,
        durationHours: 22,
        categories: ["DevOps"],
    },
];

/**
 * Upload an image file to Strapi's media library
 * Returns the file ID if successful, undefined otherwise
 */
async function uploadImage(
    strapi: Core.Strapi,
    imagePath: string
): Promise<number | undefined> {
    const assetsDir = path.join(__dirname, "..", "..", "..", "seed-assets");
    const fullPath = path.join(assetsDir, imagePath);

    if (!fs.existsSync(fullPath)) {
        strapi.log.warn(`    Image not found: ${fullPath}`);
        return undefined;
    }

    try {
        const fileBuffer = fs.readFileSync(fullPath);
        const fileName = path.basename(imagePath);
        const mimeType = getMimeType(fileName);

        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
            data: {},
            files: {
                path: fullPath,
                name: fileName,
                type: mimeType,
                size: fileBuffer.length,
            },
        });

        return uploadedFiles[0]?.id;
    } catch (error) {
        strapi.log.warn(`    Failed to upload image ${imagePath}:`, error);
        return undefined;
    }
}

function getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
    };
    return mimeTypes[ext] || "application/octet-stream";
}

export default async function seedCourses(strapi: Core.Strapi): Promise<void> {
    // Get existing courses to avoid duplicates
    const existingCourses = await strapi
        .documents("api::course.course")
        .findMany({
            fields: ["title"],
        });

    const existingTitles = new Set(existingCourses.map((c) => c.title));

    // Get all categories for linking
    const allCategories = await strapi
        .documents("api::course-category.course-category")
        .findMany({
            fields: ["id", "name"],
        });

    const categoryMap = new Map(allCategories.map((c) => [c.name, c.documentId]));

    const coursesToCreate = courses.filter(
        (course) => !existingTitles.has(course.title)
    );

    if (coursesToCreate.length === 0) {
        strapi.log.debug("    All courses already exist, skipping...");
        return;
    }

    for (const course of coursesToCreate) {
        // Resolve category IDs
        const categoryIds = (course.categories || [])
            .map((name) => categoryMap.get(name))
            .filter((id): id is string => id !== undefined);

        // Handle image upload if specified
        let imageId: number | undefined;
        if (course.imagePath) {
            imageId = await uploadImage(strapi, course.imagePath);
        }

        const created = await strapi.documents("api::course.course").create({
            data: {
                title: course.title,
                description: course.description,
                difficulty: course.difficulty,
                durationHours: course.durationHours,
                numOfRatings: 0,
                numOfSubscriptions: 0,
                course_categories: categoryIds,
                ...(imageId && { image: imageId }),
            },
        });
        // Publish the created document
        await strapi.documents("api::course.course").publish({
            documentId: created.documentId,
        });
    }

    strapi.log.debug(`    Created ${coursesToCreate.length} new courses`);
}
