/**
 * exercise router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::exercise.exercise', {
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
