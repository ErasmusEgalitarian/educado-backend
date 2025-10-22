/**
 * Policy: is-student-test policy
 * 
 * Returns true if the authenticated user exists in the Student collection.
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
            policy: 'is-student',
        });
    }


    // If there’s no authenticated user, deny access immediately
    if (!user) {
        throw new PolicyError("No authenticated user", {
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

        if(user.verifiedAt == null){
            throw new PolicyError("User not verified", {
                policy: 'is-student',
            });
        }

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
