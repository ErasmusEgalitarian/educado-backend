/**
 * exercise-option controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::exercise-option.exercise-option',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::exercise-option.exercise-option')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::exercise-option.exercise-option')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
