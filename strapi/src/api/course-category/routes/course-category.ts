/**
 * course-category router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course-category.course-category', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-student'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-student'],
        },
    }
});
