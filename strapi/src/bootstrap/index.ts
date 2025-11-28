/**
 * Data Seeder Bootstrap Module
 *
 * This module handles initial data population for the Strapi application.
 * It only runs when the SEED_DATA environment variable is set to 'true'.
 *
 * To run the seeder:
 *   SEED_DATA=true npm run develop
 *
 * To add new seeders:
 *   1. Create a new file in the seeders/ directory
 *   2. Export a default async function that takes strapi as parameter
 *   3. Register it in the seeders array below
 */

import type { Core } from "@strapi/strapi";
import seedCourseCategories from "./seeders/course-categories";
import seedCourses from "./seeders/courses";
import seedCourseSections from "./seeders/course-sections";

// Define seeder type
type Seeder = {
    name: string;
    seed: (strapi: Core.Strapi) => Promise<void>;
    order: number;
};

// Register all seeders here - they will run in order
const seeders: Seeder[] = [
    { name: "Course Categories", seed: seedCourseCategories, order: 1 },
    { name: "Courses", seed: seedCourses, order: 2 },
    { name: "Course Sections", seed: seedCourseSections, order: 3 },
    // Add more seeders here as needed:
    // { name: 'Lectures', seed: seedLectures, order: 4 },
    // { name: 'Exercises', seed: seedExercises, order: 5 },
];

/**
 * Main bootstrap function for data seeding
 */
export async function runDataSeeders(strapi: Core.Strapi): Promise<void> {
    const shouldSeed = process.env.SEED_DATA === "true";

    if (!shouldSeed) {
        strapi.log.debug(
            "Data seeding skipped. Set SEED_DATA=true to run seeders."
        );
        return;
    }

    strapi.log.info("🌱 Starting data seeding...");

    // Sort seeders by order
    const sortedSeeders = [...seeders].sort((a, b) => a.order - b.order);

    for (const seeder of sortedSeeders) {
        try {
            strapi.log.info(`  → Seeding ${seeder.name}...`);
            await seeder.seed(strapi);
            strapi.log.info(`  ✓ ${seeder.name} seeded successfully`);
        } catch (error) {
            strapi.log.error(`  ✗ Failed to seed ${seeder.name}:`, error);
            // Continue with other seeders even if one fails
        }
    }

    strapi.log.info("🌱 Data seeding completed!");
}
