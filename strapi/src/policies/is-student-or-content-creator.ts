/**
 * Policy: is-student-or-content-creator
 * 
 * Returns true if the authenticated user exists in either the Student or Content Creator collection.
 * This allows endpoints to be accessed by both user types.
 */

import { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import jwt from "jsonwebtoken"

const { PolicyError } = errors;

export default async (policyContext: any, config: any, { strapi }: { strapi: Core.Strapi }) => {

    // Gets secret key from .env
    const secretKey = process.env.JWT_SECRET;
    let user: any;

    const authHeader = policyContext.request.ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new PolicyError("Missing or invalid authorization header", {
            policy: 'is-student-or-content-creator',
        });
    }

    const authHeader = policyContext.request.ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new PolicyError("Missing or invalid authorization header", {
            policy: 'is-student-or-content-creator',
        });
    }

    try {
        // Extract the authenticated user from the policy context
        // We remove the "Bearer " prefix from the authorization header
        user = jwt.verify(authHeader.split("Bearer ")[1], secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        throw new PolicyError("JWT verification failed", {
            policy: 'is-student-or-content-creator',
        });
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

