/**
 * lecture router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::lecture.lecture', {
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
            policies: ['global::is-content-creator'],
        },
        update: {
            auth: false,
            policies: ['global::is-content-creator'],
        },
        delete: {
            auth: false,
            policies: ['global::is-content-creator'],
        },
    }
});
