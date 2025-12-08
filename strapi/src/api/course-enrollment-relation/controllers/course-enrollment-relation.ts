/**
 * course-enrollment-relation controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::course-enrollment-relation.course-enrollment-relation', {
    async find(ctx) {
        const { results, pagination } = await strapi
            .service('api::course-enrollment-relation.course-enrollment-relation')
            .find({
                ...ctx.query,
            });
        return this.transformResponse(results, { pagination });
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const result = await strapi
            .documents('api::course-enrollment-relation.course-enrollment-relation')
            .findOne({
                documentId: id,
                ...ctx.query,
            });
        return this.transformResponse(result);
    },
}
);
