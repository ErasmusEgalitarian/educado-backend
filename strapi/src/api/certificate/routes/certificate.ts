/**
 * certificate router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::certificate.certificate', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-student-or-content-creator'],
        },
    }
});
