/**
 * A set of functions called "actions" for `test-api`
 */

export default {
  exampleAction: async (ctx, next) => {
    try {
      console.log(ctx.request.body);
      //ctx.body = 'ok';
    } catch (err) {
      //ctx.body = err;
    }
  },
  examplePost: async (ctx, next) => {
    console.log(ctx)
  }
};
