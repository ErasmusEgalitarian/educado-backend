/**
 * Policy: is-student-test policy
 * 
 * Returns true if the authenticated user exists in the Student collection.
 */

import jwt from "jsonwebtoken"

export default async (policyContext, config, { strapi }) => {
    
    // Gets secret key from .env
    const secretKey = process.env.JWT_SECRET;
    let user : any;

    try {
        // Extract the authenticated user from the policy context
        // This object is populated by Strapi when the user is logged in
        const user : any = jwt.verify(policyContext.request.ctx.headers.authorization, secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        return false;
    }


    // If there’s no authenticated user, deny access immediately
    if (!user) {
        console.log(policyContext.request.ctx.request.body);
        return false;
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

        if(user.verifiedAt == null){
            console.log("Student not verified")
            return false;
        }

        // Return true if a matching Student exists (grant access),
        // or false if not (deny access)
        return !!student;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-student policy:', error);
        return false;
    }
};
