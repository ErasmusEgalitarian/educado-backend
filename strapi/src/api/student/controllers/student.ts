/**
 * student controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::student.student',
  ({ strapi }) => ({
    async find(ctx) {
      const result = await strapi
        .documents('api::student.student')
        .findMany({
          ...ctx.query,
        });

      return this.transformResponse(result);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::student.student')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
