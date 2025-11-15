/**
 * student router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::student.student', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-student'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-student'],
        },
        update: {
            auth: false,
            policies: ['global::is-student'],
        },
    }
});
