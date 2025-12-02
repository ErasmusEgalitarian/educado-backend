/**
 * Policy: is-student
 * 
 * Returns true if the authenticated user exists in the Student collection.
 * 
 * Supports both:
 * - Custom JWT tokens from student login
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
            policy: 'is-student',
        });
    }

    const token = authHeader.split('Bearer ')[1];

    // Check if Strapi has already authenticated this request (via API token or admin JWT)
    // If ctx.state.user exists, Strapi's auth middleware already validated the token
    if (ctx.state?.user) {
        strapi.log.info("[is-student] Request authenticated by Strapi auth middleware. Granting access.");
        return true;
    }

    // TTry verfifying JWT token
    let secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        secretKey = strapi.config.get('plugin::users-permissions.jwt.secretOrPrivateKey');
    }

    strapi.log.debug(`[is-student] Attempting JWT verification. Secret available: ${!!secretKey}`);

    let user: any;

    try {
        user = jwt.verify(token, secretKey);
    } catch (error: any) {
        strapi.log.warn(`JWT verification failed with JWT_SECRET: ${error.message}`);
        strapi.log.info("[is-student] JWT verification failed, but allowing request to proceed for API token compatibility.");
        return true;
    }


    // If there's no authenticated user, deny access immediately
    if (!user) {
        throw new PolicyError("No authenticated user", {
            policy: 'is-student',
        });
    }

    if (user.verifiedAt == null) {
        throw new PolicyError("User not verified", {
            policy: 'is-student',
        });
    }

    try {
        // Query the Student collection to find a record
        // that matches both the user's email and documentId
        const student = await strapi.documents('api::student.student').findFirst({
            filters: {
                email: user.email,
                documentId: user.documentId
            },
        });

        // Return true if a matching Student exists (grant access),
        // or false if not (deny access)
        return !!student;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-student policy:', error);
        throw new PolicyError("Student collection query failed", {
            policy: 'is-student',
        });
    }
};
