/**
 * course controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::course.course",
  ({ strapi }) => ({
    async find(ctx) {
      const { results, pagination } = await strapi
        .service("api::course.course")
        .find({
          ...ctx.query,
        });

      return this.transformResponse(results, { pagination });
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi.documents("api::course.course").findOne({
        documentId: id,
        ...ctx.query,
      });

      return this.transformResponse(result);
    },

    async create(ctx) {
      const { data } = ctx.request.body;

      // Extract relations (document IDs from the request)
      const categoryDocumentIds: string[] = data?.course_categories ?? [];
      const imageDocumentId: string | undefined = data?.image;

      // Look up internal ID for image if provided
      let imageId: number | undefined;
      if (imageDocumentId) {
        const image = await strapi.db.query("plugin::upload.file").findOne({
          where: { documentId: imageDocumentId },
        });
        imageId = image?.id;
      }

      // Create the course with relations
      const result = await strapi.documents("api::course.course").create({
        data: {
          title: data?.title,
          description: data?.description,
          difficulty: data?.difficulty,
          durationHours: data?.durationHours ?? 0,
          numOfRatings: data?.numOfRatings ?? 0,
          numOfSubscriptions: data?.numOfSubscriptions ?? 0,
          creator_published_at: data?.creator_published_at,
          admin_control_at: data?.admin_control_at,
          image: imageId,
          ...(categoryDocumentIds.length > 0 && {
            course_categories: { set: categoryDocumentIds },
          }),
        },
        status: ctx.query?.status as "draft" | "published" | undefined,
        populate: ["course_categories", "image"],
      });

      return this.transformResponse(result);
    },

    async update(ctx) {
      const { id } = ctx.params; // This is the documentId
      const { data } = ctx.request.body;

      // Extract relations (document IDs from the request)
      const categoryDocumentIds: string[] | undefined = data?.course_categories;
      const imageDocumentId: string | undefined = data?.image;

      // Look up internal ID for image if provided
      let imageId: number | undefined;
      if (imageDocumentId) {
        const image = await strapi.db.query("plugin::upload.file").findOne({
          where: { documentId: imageDocumentId },
        });
        imageId = image?.id;
      }

      // Update the course with relations
      const result = await strapi.documents("api::course.course").update({
        documentId: id,
        data: {
          title: data?.title,
          description: data?.description,
          difficulty: data?.difficulty,
          durationHours: data?.durationHours ?? 0,
          numOfRatings: data?.numOfRatings,
          numOfSubscriptions: data?.numOfSubscriptions,
          creator_published_at: data?.creator_published_at,
          admin_control_at: data?.admin_control_at,
          image: imageId,
          ...(categoryDocumentIds !== undefined && {
            course_categories: { set: categoryDocumentIds },
          }),
        },
        populate: ["course_categories", "image"],
      });

      return this.transformResponse(result);
    },

    async create(ctx) {
      const { data } = ctx.request.body;

      // Extract relations (document IDs from the request)
      const categoryDocumentIds: string[] = data?.course_categories ?? [];
      const imageDocumentId: string | undefined = data?.image;

      // Look up internal ID for image if provided
      let imageId: number | undefined;
      if (imageDocumentId) {
        const image = await strapi.db.query('plugin::upload.file').findOne({
          where: { documentId: imageDocumentId },
        });
        imageId = image?.id;
      }

      // Create the course with relations
      const result = await strapi.documents('api::course.course').create({
        data: {
          title: data?.title,
          description: data?.description,
          difficulty: data?.difficulty,
          durationHours: data?.durationHours ?? 0,
          numOfRatings: data?.numOfRatings ?? 0,
          numOfSubscriptions: data?.numOfSubscriptions ?? 0,
          image: imageId,
          ...(categoryDocumentIds.length > 0 && {
            course_categories: { set: categoryDocumentIds },
          }),
        },
        status: ctx.query?.status as 'draft' | 'published' | undefined,
        populate: ['course_categories', 'image'],
      });

      return this.transformResponse(result);
    },

    async update(ctx) {
      const { id } = ctx.params; // This is the documentId
      const { data } = ctx.request.body;

      // Extract relations (document IDs from the request)
      const categoryDocumentIds: string[] | undefined = data?.course_categories;
      const imageDocumentId: string | undefined = data?.image;

      // Look up internal ID for image if provided
      let imageId: number | undefined;
      if (imageDocumentId) {
        const image = await strapi.db.query('plugin::upload.file').findOne({
          where: { documentId: imageDocumentId },
        });
        imageId = image?.id;
      }

      // Update the course with relations
      const result = await strapi.documents('api::course.course').update({
        documentId: id,
        data: {
          title: data?.title,
          description: data?.description,
          difficulty: data?.difficulty,
          durationHours: data?.durationHours ?? 0,
          numOfRatings: data?.numOfRatings,
          numOfSubscriptions: data?.numOfSubscriptions,
          image: imageId,
          ...(categoryDocumentIds !== undefined && {
            course_categories: { set: categoryDocumentIds },
          }),
        },
        populate: ['course_categories', 'image'],
      });

      return this.transformResponse(result);
    },
  })
);
