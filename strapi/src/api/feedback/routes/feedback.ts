/**
 * feedback router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::feedback.feedback', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
        create: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
        update: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
        delete: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
    }
});
