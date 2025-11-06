/**
 * course-section controller
 */

import { factories } from '@strapi/strapi';
import jwt from 'jsonwebtoken';

// Helper function to extract user from JWT token
const extractUser = (ctx: any): any => {
  const secretKey = process.env.JWT_SECRET;
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    return jwt.verify(token, secretKey);
  } catch (error) {
    strapi.log.error('JWT verification failed:', error);
    return null;
  }
};

// Helper function to validate course exists and get course info
const validateCourse = async (ctx: any, courseId: string): Promise<any> => {
  const course = await strapi.documents('api::course.course' as any).findOne({
    documentId: courseId,
    populate: {
      content_creators: true
    } as any
  });

  if (!course) {
    ctx.response.status = 404;
    ctx.response.body = { error: 'Course not found' };
    return null;
  }

  return course;
};

// Helper function to check if user owns the course
const verifyOwnership = async (ctx: any, courseId: string): Promise<boolean> => {
  const user = extractUser(ctx);
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Authentication required' };
    return false;
  }

  const course = await validateCourse(ctx, courseId);
  if (!course) {
    return false; // Response already set by validateCourse
  }

  // Check if user is one of the content creators for this course
  const isOwner = (course as any).content_creators?.some((creator: any) => 
    creator.documentId === (user as any).documentId || creator.email === (user as any).email
  );

  if (!isOwner) {
    ctx.response.status = 403;
    ctx.response.body = { error: 'You can only manage sections for courses you own' };
    return false;
  }

  return true;
};

export default factories.createCoreController('api::course-section.course-section' as any, ({ strapi }) => ({
  // Enhanced find with populated relations - scoped to specific course
  async find(ctx) {
    const { courseId } = ctx.params;
    const { query } = ctx;

    // Validate course exists
    const course = await validateCourse(ctx, courseId);
    if (!course) {
      return; // Response already set by validateCourse
    }
    
    // Set default population - simplified to match Strapi v5 types
    const populate = {
      course: true,
      exercises: true,
      lectures: true
    };

    // Filter sections by the specified course
    const entity = await strapi.documents('api::course-section.course-section' as any).findMany({
      ...(query as any),
      filters: {
        ...((query as any)?.filters || {}),
        course: courseId
      },
      populate: populate as any
    });

    return this.transformResponse(entity);
  },

  // Enhanced findOne with populated relations - verify course ownership
  async findOne(ctx) {
    const { courseId, id } = ctx.params;
    const { query } = ctx;

    // Validate course exists
    const course = await validateCourse(ctx, courseId);
    if (!course) {
      return; // Response already set by validateCourse
    }

    // Set default population - simplified to match Strapi v5 types
    const populate = {
      course: true,
      exercises: true,
      lectures: true
    };

    const entity = await strapi.documents('api::course-section.course-section' as any).findOne({
      documentId: id,
      ...(query as any),
      populate: populate as any
    });

    if (!entity) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found' };
      return;
    }

    // Verify the section belongs to the specified course
    if ((entity as any).course?.documentId !== courseId) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found in this course' };
      return;
    }

    return this.transformResponse(entity);
  },

  // Enhanced create with validation - course auto-set from URL
  async create(ctx) {
    const { courseId } = ctx.params;
    const { data } = ctx.request.body;

    // Validate required fields
    if (!data.title) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Title is required' };
      return;
    }

    // Auto-set course from URL parameter, ignore any course in request body
    data.course = courseId;

    // Verify ownership of the course
    const canManage = await verifyOwnership(ctx, courseId);
    if (!canManage) {
      return; // Response already set by verifyOwnership
    }

    // Check for title uniqueness within the course
    const existingSection = await strapi.documents('api::course-section.course-section' as any).findFirst({
      filters: {
        title: data.title,
        course: data.course
      } as any
    });

    if (existingSection) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Section title must be unique within the course' };
      return;
    }

    try {
      const entity = await strapi.documents('api::course-section.course-section' as any).create({
        data,
        populate: {
          course: true,
          exercises: true,
          lectures: true
        } as any
      });

      return this.transformResponse(entity);
    } catch (error) {
      strapi.log.error('Failed to create course section:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to create course section' };
      return;
    }
  },

  // Enhanced update with validation - course-scoped
  async update(ctx) {
    const { courseId, id } = ctx.params;
    const { data } = ctx.request.body;

    // Validate course exists
    const course = await validateCourse(ctx, courseId);
    if (!course) {
      return; // Response already set by validateCourse
    }

    // Check if section exists and populate course relation
    const existingSection = await strapi.documents('api::course-section.course-section' as any).findOne({
      documentId: id,
      populate: {
        course: true
      } as any
    });

    if (!existingSection) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found' };
      return;
    }

    // Verify the section belongs to the specified course
    if ((existingSection as any).course?.documentId !== courseId) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found in this course' };
      return;
    }

    // Verify ownership of the course
    const canManage = await verifyOwnership(ctx, courseId);
    if (!canManage) {
      return; // Response already set by verifyOwnership
    }

    // If title is being updated, check for uniqueness within the course
    if (data.title && data.title !== (existingSection as any).title) {
      const duplicateSection = await strapi.documents('api::course-section.course-section' as any).findFirst({
        filters: {
          title: data.title,
          course: courseId,
          documentId: { $ne: id }
        } as any
      });

      if (duplicateSection) {
        ctx.response.status = 400;
        ctx.response.body = { error: 'Section title must be unique within the course' };
        return;
      }
    }

    // Prevent course changes - course is determined by URL
    if (data.course && data.course !== courseId) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Cannot change course - course is determined by URL path' };
      return;
    }

    // Ensure course stays the same
    data.course = courseId;

    try {
      const entity = await strapi.documents('api::course-section.course-section' as any).update({
        documentId: id,
        data,
        populate: {
          course: true,
          exercises: true,
          lectures: true
        } as any
      });

      return this.transformResponse(entity);
    } catch (error) {
      strapi.log.error('Failed to update course section:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to update course section' };
      return;
    }
  },

  // Enhanced delete with cascade handling - course-scoped
  async delete(ctx) {
    const { courseId, id } = ctx.params;

    // Validate course exists
    const course = await validateCourse(ctx, courseId);
    if (!course) {
      return; // Response already set by validateCourse
    }

    // Check if section exists
    const section = await strapi.documents('api::course-section.course-section' as any).findOne({
      documentId: id,
      populate: {
        course: true,
        exercises: true,
        lectures: true
      } as any
    });

    if (!section) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found' };
      return;
    }

    // Verify the section belongs to the specified course
    if ((section as any).course?.documentId !== courseId) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Course section not found in this course' };
      return;
    }

    // Verify ownership of the course
    const canManage = await verifyOwnership(ctx, courseId);
    if (!canManage) {
      return; // Response already set by verifyOwnership
    }

    try {
      const entity = await strapi.documents('api::course-section.course-section' as any).delete({
        documentId: id
      });

      return this.transformResponse(entity);
    } catch (error) {
      strapi.log.error('Failed to delete course section:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to delete course section' };
      return;
    }
  },

}));