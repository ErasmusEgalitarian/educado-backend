import { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import jwt from "jsonwebtoken";

const { PolicyError } = errors;

export default async (
    policyContext: any,
    config: any,
    { strapi }: { strapi: Core.Strapi }
) => {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        throw new PolicyError("JWT_SECRET is not defined", {
            policy: "is-admin",
        });
    }

    const authHeader = policyContext.request.ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new PolicyError("Missing or invalid authorization header", {
            policy: "is-admin",
        });
    }

    let user: any;
    try {
        user = jwt.verify(authHeader.split("Bearer ")[1], secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        throw new PolicyError("JWT verification failed", {
            policy: "is-admin",
        });
    }

    if (!user) {
        throw new PolicyError("No authenticated user", {
            policy: "is-admin",
        });
    }
    
    if (user.verifiedAt == null) {
        throw new PolicyError("User not verified", {
            policy: "is-admin",
        });
    }

    try {
        // Same query pattern as is-content-creator
        const contentCreator = await strapi
            .documents("api::content-creator.content-creator")
            .findFirst({
                filters: {
                    email: user.email,
                    documentId: user.documentId,
                },
            });

        if (!contentCreator) {
            throw new PolicyError("Content Creator not found", {
                policy: "is-admin",
            });
        }

        if (contentCreator.isAdmin === true) {
            return true;
        }

        throw new PolicyError("User is not an admin", {
            policy: "is-admin",
        });
    } catch (error: any) {
        strapi.log.error("Error in is-admin policy:", error);

        if (error instanceof PolicyError) {
            throw error;
        }

        throw new PolicyError("Admin check failed", {
            policy: "is-admin",
        });
    }
};