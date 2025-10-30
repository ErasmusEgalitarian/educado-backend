/**
 * course-section router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/:courseId/sections',
      handler: 'course-section.find',
      config: {
        policies: ['global::is-student'],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/courses/:courseId/sections/:id',
      handler: 'course-section.findOne',
      config: {
        policies: ['global::is-student'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/courses/:courseId/sections',
      handler: 'course-section.create',
      config: {
        policies: ['global::is-content-creator'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/courses/:courseId/sections/:id',
      handler: 'course-section.update',
      config: {
        policies: ['global::is-content-creator'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/courses/:courseId/sections/:id',
      handler: 'course-section.delete',
      config: {
        policies: ['global::is-content-creator'],
        middlewares: [],
      },
    },
  ],
};
