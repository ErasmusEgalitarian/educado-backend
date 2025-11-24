/**
 * exercise controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::exercise.exercise',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::exercise.exercise')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
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
