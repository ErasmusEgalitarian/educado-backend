/**
 * Course Categories Seeder
 *
 * Seeds initial course categories into the database.
 * Checks for existing categories to avoid duplicates.
 */

import type { Core } from "@strapi/strapi";

// Define your course categories here
const courseCategories = [
    { name: "Programming" },
    { name: "Web Development" },
    { name: "Data Science" },
    { name: "Mobile Development" },
    { name: "DevOps" },
    { name: "Design" },
    { name: "Business" },
    { name: "Language Learning" },
    { name: "Mathematics" },
    { name: "Science" },
];

export default async function seedCourseCategories(
    strapi: Core.Strapi
): Promise<void> {
    const existingCategories = await strapi.documents(
        "api::course-category.course-category"
    ).findMany({
        fields: ["name"],
    });

    const existingNames = new Set(existingCategories.map((c) => c.name));

    const categoriesToCreate = courseCategories.filter(
        (category) => !existingNames.has(category.name)
    );

    if (categoriesToCreate.length === 0) {
        strapi.log.debug("    All course categories already exist, skipping...");
        return;
    }

    for (const category of categoriesToCreate) {
        const created = await strapi.documents("api::course-category.course-category").create({
            data: {
                name: category.name,
            },
        });
        // Publish the created document
        await strapi.documents("api::course-category.course-category").publish({
            documentId: created.documentId,
        });
    }

    strapi.log.debug(
        `    Created ${categoriesToCreate.length} new course categories`
    );
}
