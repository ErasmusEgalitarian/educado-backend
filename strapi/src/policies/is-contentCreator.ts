/**
 * Policy: is-content-creator
 * 
 * Returns true if the authenticated user exists in the Content Creator collection.
 * 
 * TODO:
 * Implement JWT for decrypting the token into usable object
 */

export default async (policyContext, config, { strapi }) => {
    // Add your own logic here.
    const user = policyContext.state.user;

    if (!user) {
        console.log(policyContext.request.ctx.request.body);
        return false;
    }

    try {
        const student = await strapi.db.query('api::content-creator.content-creator').findFirst({
            filters: { email: user.email, documentId: user.documentId },
        });

        return !!student;
    } catch (error) {
        strapi.log.error('Error in is-content-creator policy:', error);
        return false;
    }
};
