import { factories } from '@strapi/strapi'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { errorCodes } from '../../../helpers/errorCodes';
import { sendVerificationEmail } from '../../../helpers/email';

export default factories.createCoreController('api::content-creator.content-creator', ({ strapi }) => ({
    async register(ctx) {
        try {
            console.log("Registration request received:", ctx.request.body);
            const institutionalMails = ["student.aau.dk"];

            const {
                firstName,
                lastName,
                email,
                password,
                motivation,
                jobs = [],
                educations = [],
            } = ctx.request.body;
            if (!firstName || !lastName || !email || !password) {
                return ctx.badRequest("Missing required fields.");
            }
            if (!Array.isArray(jobs) || jobs.length === 0) {
                return ctx.badRequest("At least one job is required");
            }
            if (!Array.isArray(educations) || educations.length === 0) {
                return ctx.badRequest("At least one education is required");
            }
            const existing = await strapi.db.query('api::content-creator.content-creator').findOne({
                where: { email },
            });

            if (existing) {
                console.log("Email already in use:", email);
                return ctx.badRequest('Email already in use')
            }
            const domain = email.split('@')[1]?.toLowerCase();
            const isTrusted = institutionalMails.includes(domain)
            const confirmationDate = isTrusted ? new Date() : null;

            const jobDocs = await Promise.all(
                jobs.map((job) =>
                    strapi.documents("api::job.job").create({
                        data: {
                            company: job.company,
                            Title: job.title,
                            StartDate: job.startDate,
                            EndDate: job.endDate,
                            Description: job.description,
                        },
                        status: "published",
                    })
                )
            );
            const educationDocs = await Promise.all(
                educations.map((edu) =>
                    strapi.documents("api::education.education").create({
                        data: {
                            educationType: edu.educationType,
                            courseExperience: edu.course,
                            institution: edu.institution,
                            startDate: edu.startDate,
                            endDate: edu.endDate,

                        },
                        status: "published",
                    })
                )
            );
            const currentCompany =
                jobDocs.find((j) => !j.endDate || j.endDate.trim() === "")?.company ??
                jobs[0]?.company ?? // fallback to first job
                null;
            const newUser = await strapi.documents('api::content-creator.content-creator').create({
                data: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    verifiedAt: confirmationDate,
                    motivation: motivation,
                    currentCompany: currentCompany,
                    jobs: jobDocs.map((j) => j.documentId),
                    educations: educationDocs.map((e) => e.documentId),
                },
                status: "published"
            })
            // Utility functions
            function generateTokenCode(length) {
                let result = '';
                const characters = '0123456789'; // Only numbers
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            const code = generateTokenCode(4);
            sendVerificationEmail(newUser, code);

            ctx.send({
                status: isTrusted ? 'approved' : 'pending',
                userId: newUser.id,
                verifiedAt: confirmationDate,
                message: isTrusted
                    ? `User registered and auto-approved on ${confirmationDate!.toISOString()}.`
                    : 'Registration successful. Waiting for admin approval.',
            });
        }
        catch (err) {
            console.error("Registration error:", err);
            ctx.badRequest('Registration failed', { error: err.message });
        }
    },
    async login(ctx) {
        try {
            // Access request data via ctx.request.body
            const { email, password } = ctx.request.body;

            const user = await strapi.documents('api::content-creator.content-creator').findFirst({
                filters: { email: email.toLowerCase() },
            });
            if (!user) {
                return ctx.badRequest('Invalid email or password', {
                    error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }
                });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return ctx.badRequest('Invalid email or password', {
                    error: { code: errorCodes.E0106.code, message: errorCodes.E0106.message }
                });
            }
            if (user.verifiedAt == null) {
                return ctx.badRequest('Admin approval is required.', {
                    error: { code: errorCodes.E1001.code, message: errorCodes.E1001.message }
                });
            }
            const jwtContentCreator: ContentCreator = {
                documentId: user.documentId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : null,
            }
            // 3. Generate token
            const token = jwt.sign(
                jwtContentCreator,
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // 4. Respond with token and user info
            return ctx.send({
                accessToken: token,
                userInfo: {
                    documentId: user.documentId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    verifiedAt: user.verifiedAt ? new Date(user.verifiedAt).toISOString() : null,
                },
            });
        } catch (err) {
            console.error(err);
            return ctx.internalServerError('Something went wrong');
        }
    },
        async update(ctx) {
        // Remove password from the request if it's empty or not provided
        if (ctx.request.body?.data) {
            const password = ctx.request.body.data.password;
            // Trim and check for undefined, null, empty string, and whitespace
            if (typeof password !== 'string' || password.trim() === '') {
                delete ctx.request.body.data.password;
            }
        }

        // Call the default update controller
        return await super.update(ctx);
    },
}));
