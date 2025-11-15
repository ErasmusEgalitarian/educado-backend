/**
 * course-selection router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course-selection.course-selection', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-student'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-student'],
        },
        create: {
            auth: false,
            policies: ['global::is-student'],
        },
        update: {
            auth: false,
            policies: ['global::is-student'],
        },
        delete: {
            auth: false,
            policies: ['global::is-student'],
        },
    }
});
