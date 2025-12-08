/**
 * course-enrollment-relation controller
 */

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import jwt from 'jsonwebtoken';

const { ForbiddenError } = errors;

export default factories.createCoreController(
    'api::course-enrollment-relation.course-enrollment-relation',
    ({ strapi }) => ({
    async find(ctx) {
        const { results, pagination } = await strapi
            .service('api::course-enrollment-relation.course-enrollment-relation')
            .find({
                ...ctx.query,
            });
        return this.transformResponse(results, { pagination });
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const result = await strapi
            .documents('api::course-enrollment-relation.course-enrollment-relation')
            .findOne({
                documentId: id,
                ...ctx.query,
            });
        return this.transformResponse(result);
    },
    async create(ctx) {
        const authHeader = ctx.request.headers.authorization;
        const secretKey = process.env.JWT_SECRET;

        // If there's an auth header, validate that students can only create enrollments for themselves
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split('Bearer ')[1];
                const user = jwt.verify(token, secretKey) as any;

                // Check if user is a student
                const student = await strapi.documents('api::student.student').findFirst({
                    filters: {
                        email: user.email,
                        documentId: user.documentId
                    },
                });

                // If user is a student, ensure they can only enroll themselves
                if (student && ctx.request.body?.data?.student) {
                    const requestedStudentId = ctx.request.body.data.student;
                    const studentDocumentId = student.documentId;

                    // Allow if student is enrolling themselves, or if it's a content creator
                    if (requestedStudentId !== studentDocumentId) {
                        // Check if user is a content creator
                        const contentCreator = await strapi.documents('api::content-creator.content-creator').findFirst({
                            filters: {
                                email: user.email,
                                documentId: user.documentId
                            },
                        });

                        if (!contentCreator) {
                            throw new ForbiddenError('Students can only create enrollments for themselves');
                        }
                    }
                }
            } catch (error) {
                // If JWT verification fails, let the policy handle it
                if (!(error instanceof ForbiddenError)) {
                    // Continue with the request - policy will handle auth
                } else {
                    throw error;
                }
            }
        }

        // Validate and check if enrollment already exists
        const { data } = ctx.request.body;
        if (data?.student && data?.course) {
            // Verify student exists
            const studentExists = await strapi
                .documents('api::student.student')
                .findOne({ documentId: data.student });
            
            if (!studentExists) {
                ctx.response.status = 400;
                return {
                    error: {
                        status: 400,
                        message: 'Student not found',
                    },
                };
            }

            // Verify course exists
            const courseExists = await strapi
                .documents('api::course.course')
                .findOne({ documentId: data.course });
            
            if (!courseExists) {
                ctx.response.status = 400;
                return {
                    error: {
                        status: 400,
                        message: 'Course not found',
                    },
                };
            }

            // Check if enrollment already exists
            const existingEnrollment = await strapi
                .documents('api::course-enrollment-relation.course-enrollment-relation')
                .findFirst({
                    filters: {
                        student: {
                            documentId: data.student,
                        },
                        course: {
                            documentId: data.course,
                        },
                    },
                });

            if (existingEnrollment) {
                ctx.response.status = 400;
                return {
                    error: {
                        status: 400,
                        message: 'Student is already enrolled in this course',
                    },
                };
            }
        } else {
            ctx.response.status = 400;
            return {
                error: {
                    status: 400,
                    message: 'Missing required fields: student and course',
                },
            };
        }

        // Create the enrollment relation using the documents API
        try {
            const result = await strapi
                .documents('api::course-enrollment-relation.course-enrollment-relation')
                .create({
                    data: {
                        student: data.student,
                        course: data.course,
                        enrollmentDate: data.enrollmentDate,
                    },
                });
            return this.transformResponse(result);
        } catch (error) {
            strapi.log.error('Error creating course enrollment relation:', error);
            ctx.response.status = 400;
            return {
                error: {
                    status: 400,
                    message: error.message || 'Failed to create enrollment relation',
                },
            };
        }
    },
    async delete(ctx) {
        const authHeader = ctx.request.headers.authorization;
        const secretKey = process.env.JWT_SECRET;

        // If there's an auth header, validate that students can only delete their own enrollments
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split('Bearer ')[1];
                const user = jwt.verify(token, secretKey) as any;

                // Check if user is a student
                const student = await strapi.documents('api::student.student').findFirst({
                    filters: {
                        email: user.email,
                        documentId: user.documentId
                    },
                });

                // If user is a student, ensure they can only delete their own enrollments
                if (student) {
                    const enrollmentId = ctx.params.id;
                    const enrollment = await strapi
                        .documents('api::course-enrollment-relation.course-enrollment-relation')
                        .findOne({
                            documentId: enrollmentId,
                            populate: ['student'],
                        });

                    if (enrollment?.student) {
                        const enrollmentStudentId = 
                            typeof enrollment.student === 'object' && 'documentId' in enrollment.student
                                ? enrollment.student.documentId
                                : enrollment.student;

                        // Check if user is a content creator
                        const contentCreator = await strapi.documents('api::content-creator.content-creator').findFirst({
                            filters: {
                                email: user.email,
                                documentId: user.documentId
                            },
                        });

                        // Allow if student is deleting their own enrollment, or if it's a content creator
                        if (enrollmentStudentId !== student.documentId && !contentCreator) {
                            throw new ForbiddenError('Students can only delete their own enrollments');
                        }
                    }
                }
            } catch (error) {
                // If JWT verification fails, let the policy handle it
                if (!(error instanceof ForbiddenError)) {
                    // Continue with the request - policy will handle auth
                } else {
                    throw error;
                }
            }
        }

        // Delete the enrollment relation using the service
        const { id } = ctx.params;
        const result = await strapi
            .documents('api::course-enrollment-relation.course-enrollment-relation')
            .delete({
                documentId: id,
            });
        return this.transformResponse(result);
    },
    })
);
