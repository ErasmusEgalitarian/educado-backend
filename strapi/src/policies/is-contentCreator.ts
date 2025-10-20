/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 */

import jwt from "jsonwebtoken"

export default async (policyContext, config, { strapi }) => {

    //gets secret key from .env
    const secretKey = process.env.JWT_SECRET;

    // Extract the authenticated user from the policy context
    // This object is populated by Strapi when the user is logged in
    const user : any = jwt.verify(policyContext.request.ctx.headers.authorization, secretKey);

    // If there’s no authenticated user, deny access immediately
    if (!user) {
        console.log(policyContext.request.ctx.request.body);
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

        if(user.verifiedAt != null){
            console.log("Content creator not verified")
            return false;
        }

        console.log("is-contentCreator policy passed");

        // Return true if a matching Content Creator exists (grant access),
        // or false if not (deny access)
        return !!contentCreator;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-content-creator policy:', error);
        return false;
    }
};
