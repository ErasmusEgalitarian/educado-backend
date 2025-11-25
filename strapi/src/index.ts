// import type { Core } from '@strapi/strapi';
import { Core } from "@strapi/strapi";
import { mergeSwaggerDocumentation } from "./extensions/documentation/merge-openapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {
    
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Merge custom API documentation with auto-generated Strapi API documentation for CRUD
    mergeSwaggerDocumentation();

    // Enable all API endpoints for both Public and Authenticated roles
    try {
      // Get both the Public and Authenticated roles
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.error('Public role not found');
        return;
      }

      const rolesToUpdate = [
        { role: publicRole, name: 'Public' },
      ];

      // Debug: Check the structure of the role object
      console.log('\nPublic role structure:', JSON.stringify(publicRole, null, 2));

      console.log('\nSetting permissions for Public role...');

      // List of all API content types
      const apiContentTypes = [
        'api::certificate.certificate',
        'api::content-creator.content-creator',
        'api::course.course',
        'api::course-category.course-category',
        'api::course-selection.course-selection',
        'api::exercise.exercise',
        'api::exercise-option.exercise-option',
        'api::feedback.feedback',
        'api::lecture.lecture',
        'api::password-reset-token.password-reset-token',
        'api::student.student',
      ];

      // CRUD actions to enable
      const actionsToEnable = ['find', 'findOne'];

      // Process each role
      for (const { role, name } of rolesToUpdate) {
        console.log(`\n--- Setting permissions for ${name} role (ID: ${role.id}) ---`);

        // Get permissions for this specific role
        const rolePermissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: role.id },
        });

        console.log(`Found ${rolePermissions.length} existing permissions for ${name} role`);

        // Build a map of existing actions
        const existingActions = new Set(rolePermissions.map(p => p.action));

        let createdCount = 0;
        let skippedCount = 0;

        // Create permissions for all API content types and CRUD actions
        for (const contentType of apiContentTypes) {
          for (const action of actionsToEnable) {
            const permissionAction = `${contentType}.${action}`;
            
            if (existingActions.has(permissionAction)) {
              console.log(`  ⊙ Already exists: ${permissionAction}`);
              skippedCount++;
            } else {
              try {
                // Create permission with explicit role connection
                await strapi.query('plugin::users-permissions.permission').create({
                  data: {
                    action: permissionAction,
                    role: {
                      connect: [{ id: role.id }]
                    },
                  },
                });
                console.log(`  ✓ Created: ${permissionAction}`);
                createdCount++;
              } catch (error) {
                // If connect syntax fails, try direct ID assignment
                try {
                  await strapi.query('plugin::users-permissions.permission').create({
                    data: {
                      action: permissionAction,
                      role: role.id,
                    },
                  });
                  console.log(`  ✓ Created (fallback): ${permissionAction}`);
                  createdCount++;
                } catch (fallbackError) {
                  console.error(`  ✗ Failed to create ${permissionAction}:`, fallbackError.message);
                }
              }
            }
          }
        }

        console.log(`✅ ${name} role: ${createdCount} permissions created, ${skippedCount} already existed`);

        // Verify: Check if permissions are properly linked to the role
        const verifyPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: role.id },
        });
        console.log(`   Verification: ${verifyPermissions.length} total permissions now linked to ${name} role`);
      }

      console.log('\n📍 Check in Strapi Dashboard: Settings > Users & Permissions plugin > Roles\n');
      

    } catch (error) {
      console.error('Error setting public role permissions:', error);
      console.error('Error stack:', error.stack);
    }
  },
};
