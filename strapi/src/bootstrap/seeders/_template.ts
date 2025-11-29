/**
 * Template Seeder
 *
 * Copy this file and modify it to create a new seeder.
 * Don't forget to register your seeder in ../index.ts!
 *
 * NOTE: This file contains placeholder content types that will show TypeScript errors.
 * Replace "api::your-content-type.your-content-type" with your actual content type.
 *
 * Available content types (from contentTypes.d.ts):
 * - api::certificate.certificate
 * - api::content-creator.content-creator
 * - api::course.course
 * - api::course-category.course-category
 * - api::course-selection.course-selection
 * - api::dashboard-activity.dashboard-activity
 * - api::exercise.exercise
 * - api::exercise-option.exercise-option
 * - api::feedback.feedback
 * - api::lecture.lecture
 * - api::password-reset-token.password-reset-token
 * - api::student.student
 * - api::user-log.user-log
 * - api::verification-token.verification-token
 */

// @ts-nocheck - This is a template file with placeholder types

import type { Core } from "@strapi/strapi";

// Define your data here
interface YourDataSeed {
    // Add your fields here
    name: string;
}

const yourData: YourDataSeed[] = [
    { name: "Example Item 1" },
    { name: "Example Item 2" },
];

export default async function seedYourData(strapi: Core.Strapi): Promise<void> {
    // 1. Get existing items to avoid duplicates
    const existingItems = await strapi
        .documents("api::your-content-type.your-content-type")
        .findMany({
            fields: ["name"], // Fields to check for duplicates
        });

    const existingNames = new Set(existingItems.map((item) => item.name));

    // 2. Filter out items that already exist
    const itemsToCreate = yourData.filter(
        (item) => !existingNames.has(item.name)
    );

    if (itemsToCreate.length === 0) {
        strapi.log.debug("    All items already exist, skipping...");
        return;
    }

    // 3. Create new items
    for (const item of itemsToCreate) {
        await strapi.documents("api::your-content-type.your-content-type").create({
            data: {
                name: item.name,
                // Add more fields as needed
                publishedAt: new Date(), // Auto-publish
            },
        });
    }

    strapi.log.debug(`    Created ${itemsToCreate.length} new items`);
}
