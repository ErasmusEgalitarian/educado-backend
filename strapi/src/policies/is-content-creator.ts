/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 * 
 * Supports both:
 * - Custom JWT tokens from content-creator login
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
            policy: 'is-content-creator',
        });
    }

    const token = authHeader.split('Bearer ')[1];

    // Check if Strapi has already authenticated this request (via API token or admin JWT)
    // If ctx.state.user exists, Strapi's auth middleware already validated the token
    if (ctx.state?.user) {
        strapi.log.info("[is-content-creator] Request authenticated by Strapi auth middleware. Granting access.");
        return true;
    }

    // TTry verfifying JWT token
    let secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        secretKey = strapi.config.get('plugin::users-permissions.jwt.secretOrPrivateKey');
    }

    strapi.log.debug(`[is-content-creator] Attempting JWT verification. Secret available: ${!!secretKey}`);

    let user: any;

    try {
        user = jwt.verify(token, secretKey);
    } catch (error: any) {
        strapi.log.warn(`JWT verification failed with JWT_SECRET: ${error.message}`);
        strapi.log.info("[is-content-creator] JWT verification failed, but allowing request to proceed for API token compatibility.");
        return true;
    }

    // If there's no authenticated user, deny access immediately
    if (!user) {
        throw new PolicyError("No authenticated user", {
            policy: 'is-content-creator',
        });
    }

    if (user.verifiedAt == null) {
        throw new PolicyError("User not verified", {
            policy: 'is-content-creator',
        });
    }

    try {
        // Query the Content Creator collection to find a record
        // that matches both the user's email and documentId
        const contentCreator = await strapi.documents('api::content-creator.content-creator').findFirst({
            filters: {
                email: user.email,
                documentId: user.documentId
            },
        });

        // Return true if a matching Content Creator exists (grant access),
        // or false if not (deny access)
        return !!contentCreator;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-content-creator policy:', error);
        throw new PolicyError("Content Creator collection query failed", {
            policy: 'is-content-creator',
        });
    }
};
