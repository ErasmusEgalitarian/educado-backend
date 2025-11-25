/**
 * certificate controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::certificate.certificate',
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service('api::certificate.certificate')
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi
        .documents('api::certificate.certificate')
        .findOne({
          documentId: id,
          ...ctx.query,
        });

      return this.transformResponse(result);
    },
  })
);
