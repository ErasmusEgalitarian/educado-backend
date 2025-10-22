/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 */

import { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import jwt from "jsonwebtoken"

const { PolicyError } = errors;

export default async (policyContext: any, config: any, { strapi }: { strapi: Core.Strapi }) => {

    // Gets secret key from .env
    const secretKey = process.env.JWT_SECRET;
    let user : any;

    try {
        // Extract the authenticated user from the policy context
        // This object is populated by Strapi when the user is logged in
        user = jwt.verify(policyContext.request.ctx.headers.authorization, secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        throw new PolicyError("JWT verification failed", {
            policy: 'is-contentCreator',
        });
    }

    // If there’s no authenticated user, deny access immediately
    if (!user) {
        throw new PolicyError("No authenticated user", {
            policy: 'is-contentCreator',
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

        if(user.verifiedAt == null){
            throw new PolicyError("User not verified", {
                policy: 'is-contentCreator',
            });
        }

        // Return true if a matching Content Creator exists (grant access),
        // or false if not (deny access)
        return !!contentCreator;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-content-creator policy:', error);
        throw new PolicyError("Content Creator collection query failed", {
            policy: 'is-contentCreator',
        });
    }
};
