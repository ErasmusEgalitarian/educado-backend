/**
 * Policy: is-student-test policy
 * 
 * Returns true if the authenticated user exists in the Student collection.
 *  
 * TODO:
 * Implement JWT for decrypting the context token into usable object
 */

export default async (policyContext, config, { strapi }) => {
    // Add your own logic here.
    const user = policyContext.state.user;

    if (!user) {
        console.log(policyContext.request.ctx.request.body);
        return false;
    }

    try {
        const student = await strapi.db.query('api::student.student').findFirst({
            filters: { 
                email: user.email, 
                documentId: user.documentId 
            },
        });

        return !!student;
    } catch (error) {
        strapi.log.error('Error in is-student policy:', error);
        return false;
    }
};
