import type { Context } from "koa";

interface ContentCreatorDoc {
    documentId: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    statusValue: string;
    isAdmin?: boolean;
    createdAt?: string;

    biography?: string;
    education?: string;
    courseExperience?: string;
    institution?: string;
    eduStart?: string;
    eduEnd?: string;
    currentCompany?: string;
    currentJobTitle?: string;
    companyStart?: string;
    companyEnd?: string;
    jobDescription?: string;
}

/**
 * Admin view of Content Creators in the shape expected by AdminServices.
 */
const userInfoController = {
    // GET /api/user-info
    async find(ctx: Context) {
        try {
            const creators = (await strapi
                .documents("api::content-creator.content-creator")
                .findMany({
                    sort: { createdAt: "desc" },
                })) as ContentCreatorDoc[];

            const data = creators.map((creator) => ({
                _id: creator.documentId,
                firstName: creator.firstName,
                lastName: creator.lastName,
                email: creator.email,
                approved: creator.statusValue === "APPROVED",
                rejected: creator.statusValue === "REJECTED",
                isAdmin: !!creator.isAdmin,
                joinedAt: creator.createdAt,
            }));

            ctx.body = { data };
        } catch (err) {
            strapi.log.error("Error in user-info.find", err);
            return ctx.internalServerError("Unable to fetch user info");
        }
    },

    // GET /api/user-info/:id
    async findOne(ctx: Context) {
        const { id } = ctx.params; // documentId

        try {
            const creator = (await strapi
                .documents("api::content-creator.content-creator")
                .findFirst({
                    filters: { documentId: id },
                })) as ContentCreatorDoc | null;

            if (!creator) {
                return ctx.notFound("Content creator not found");
            }

            ctx.body = {
                data: {
                    applicator: {
                        _id: creator.documentId,
                        firstName: creator.firstName,
                        lastName: creator.lastName,
                        email: creator.email,
                        approved: creator.statusValue === "APPROVED",
                        rejected: creator.statusValue === "REJECTED",
                        isAdmin: !!creator.isAdmin,
                        joinedAt: creator.createdAt,
                    },
                    application: {
                        biography: creator.biography,
                        education: creator.education,
                        statusValue: creator.statusValue,
                        courseExperience: creator.courseExperience,
                        institution: creator.institution,
                        eduStart: creator.eduStart,
                        eduEnd: creator.eduEnd,
                        currentCompany: creator.currentCompany,
                        currentJobTitle: creator.currentJobTitle,
                        companyStart: creator.companyStart,
                        companyEnd: creator.companyEnd,
                        jobDescription: creator.jobDescription,
                    },
                },
            };
        } catch (err) {
            strapi.log.error("Error in user-info.findOne", err);
            return ctx.internalServerError("Unable to fetch content creator info");
        }
    },
};

export default userInfoController;