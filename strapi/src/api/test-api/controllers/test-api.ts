/**
 * A set of functions called "actions" for `test-api`
 */

export default {
  exampleAction: async (ctx, next) => {
    try {
      let url = 'http://localhost:1337/api/';

      /*
      let studentsResponse = await fetch(url + "students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer 1565acefb01945b75b759fc0523792a7035b04bd0ed7c576e4ebde989a7f8580b3057dd90fbdeb3735697c451a71db1fcd85c1b96af5af537c17c3b5bf9cfce14aa8b668f42dc67758d910f34aa537079d8e8128186cfb0c0dc1fc69b10e2158e335277fcd9a365d29bce793afb4791ff62fc0f9be4968c97faf19ff55b4b673"
        }
      });
      */

      let studentsResponse = await strapi.documents('api::student.student');
      let students = await studentsResponse.findMany();

      ctx.response.body = students;

    } catch (err) {
      //ctx.body = err;
    }
  },
  examplePost: async (ctx, next) => {
    console.log(ctx)
  }
};
