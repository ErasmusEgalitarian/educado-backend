/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 * 
 * TODO:
 * Implement JWT for decrypting the context token into usable object
 */

export default async (policyContext, config, { strapi }) => {
    // Extract the authenticated user from the policy context
    // This object is populated by Strapi when the user is logged in
    const user = policyContext.state.user;

    // If there’s no authenticated user, deny access immediately
    if (!user) {
        console.log(policyContext.request.ctx.request.body);
        return false;
    }

    try {
        // Query the Content Creator collection to find a record
        // that matches both the user's email and documentId
        const student = await strapi.db.query('api::content-creator.content-creator').findFirst({
            filters: { 
                email: user.email, 
                documentId: user.documentId 
            },
        });

        // Return true if a matching Content Creator exists (grant access),
        // or false if not (deny access)
        return !!student;
    } catch (error) {
        // If an error occurs during the query, log it and deny access
        strapi.log.error('Error in is-content-creator policy:', error);
        return false;
    }
};
