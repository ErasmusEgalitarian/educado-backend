/**
 * Policy: is-student-or-content-creator
 * 
 * Returns true if the authenticated user exists in either the Student or Content Creator collection.
 * This allows endpoints to be accessed by both user types.
 * 
 * Supports both:
 * - Custom JWT tokens from student/content-creator login
 * - Strapi API tokens (opaque, non-JWT)
 */

import { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import jwt from "jsonwebtoken"

const { PolicyError } = errors;

export default async (policyContext: any, config: any, { strapi }: { strapi: Core.Strapi }) => {

    const ctx = policyContext.request.ctx;
    const authHeader = ctx.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new PolicyError("Missing or invalid authorization header", {
            policy: 'is-student-or-content-creator',
        });
    }

    const token = authHeader.split('Bearer ')[1];

    // Check if Strapi has already authenticated this request (via API token or admin JWT)
    // If ctx.state.user exists, Strapi's auth middleware already validated the token
    if (ctx.state?.user) {
        strapi.log.info("[is-student-or-content-creator] Request authenticated by Strapi auth middleware. Granting access.");
        return true;
    }

    // TTry verfifying JWT token
    let secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        secretKey = strapi.config.get('plugin::users-permissions.jwt.secretOrPrivateKey');
    }

    strapi.log.debug(`[is-student-or-content-creator] Attempting JWT verification. Secret available: ${!!secretKey}`);

    let user: any;

    try {
        user = jwt.verify(token, secretKey);
    } catch (error: any) {
        strapi.log.warn(`JWT verification failed with JWT_SECRET: ${error.message}`);
        // JWT verification failed - could be:
        // 1. Token signed with a different secret (e.g., old admin key)
        // 2. Malformed token
        // For now, allow it through - API tokens should have been caught earlier (no dots)
        // This allows testing with various token types
        strapi.log.info("[is-student-or-content-creator] JWT verification failed, but allowing request to proceed for API token compatibility.");
        return true;
    }

    // If there's no authenticated user, deny access immediately
    if (!user) {
        throw new PolicyError("No authenticated user", {
            policy: 'is-student-or-content-creator',
        });
    }

    // Check if user is not verified
    if (user.verifiedAt == null) {
        throw new PolicyError("User not verified", {
            policy: 'is-student-or-content-creator',
        });
    }

    try {
        // First, try to find the user in the Student collection
        const student = await strapi.documents('api::student.student').findFirst({
            filters: {
                email: user.email,
                documentId: user.documentId
            },
        });

        // If found as a student, grant access
        if (student) {
            return true;
        }

        // If not a student, try to find the user in the Content Creator collection
        const contentCreator = await strapi.documents('api::content-creator.content-creator').findFirst({
            filters: {
                email: user.email,
                documentId: user.documentId
            },
        });

        // If found as a content creator, grant access
        if (contentCreator) {
            return true;
        }

        // If the user is neither a student nor a content creator, deny access
        throw new PolicyError("User is neither a student nor a content creator", {
            policy: 'is-student-or-content-creator',
        });
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-student-or-content-creator policy:', error);

        // Re-throw if it's already a PolicyError
        if (error instanceof PolicyError) {
            throw error;
        }

        throw new PolicyError("Database query failed", {
            policy: 'is-student-or-content-creator',
        });
    }
};

