/**
 * exercise controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::exercise.exercise',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::exercise.exercise')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::exercise.exercise')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
