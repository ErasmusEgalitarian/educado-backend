/**
 * content-creator router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::content-creator.content-creator', {
    config: {
        find: {
            auth: false,
            policies: ['global::is-content-creator'],
        },
        findOne: {
            auth: false,
            policies: ['global::is-content-creator'],
        },
        update: {
            auth: false,
            policies: ['global::is-content-creator'],
        },
    }
});


