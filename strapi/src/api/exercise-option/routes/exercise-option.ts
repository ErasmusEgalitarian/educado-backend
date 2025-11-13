/**
 * exercise-option router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::exercise-option.exercise-option', {
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
