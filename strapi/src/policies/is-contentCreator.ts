/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 */

import jwt from "jsonwebtoken"

export default async (policyContext, config, { strapi }) => {

    // Gets secret key from .env
    const secretKey = process.env.JWT_SECRET;
    let user : any;

    try {
        // Extract the authenticated user from the policy context
        // This object is populated by Strapi when the user is logged in
        user = jwt.verify(policyContext.request.ctx.headers.authorization, secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        return false;
    }

    // If there’s no authenticated user, deny access immediately
    if (!user) {
        return false;
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
            return false;
        }

        // Return true if a matching Content Creator exists (grant access),
        // or false if not (deny access)
        return !!contentCreator;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-content-creator policy:', error);
        return false;
    }
};
