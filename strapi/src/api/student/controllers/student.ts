/**
 * student controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::student.student', ({ strapi }) => ({
  /**
   * Override findOne to support populate query parameter
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { populate } = ctx.query;

    // Parse populate array from query string
    let populateObj = {};
    if (populate) {
      const populateArray = Array.isArray(populate) ? populate : [populate];
      populateArray.forEach((field: string) => {
        populateObj[field] = true;
      });
    }

    // Call the service with populate
    const result = await strapi
      .service('api::student.student')
      .findOne(id, { populate: populateObj });

    ctx.body = { data: result };
  },

  /**
   * Override find to support populate query parameter
   */
  async find(ctx) {
    const { populate } = ctx.query;

    // Parse populate array from query string
    let populateObj = {};
    if (populate) {
      const populateArray = Array.isArray(populate) ? populate : [populate];
      populateArray.forEach((field: string) => {
        populateObj[field] = true;
      });
    }

    // Call the service with populate
    const results = await strapi
      .service('api::student.student')
      .find({ populate: populateObj });

    ctx.body = { data: results };
  },
}));
