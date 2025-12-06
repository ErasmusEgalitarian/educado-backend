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

    let payload: any;
    try {
        const token = authHeader.slice("Bearer ".length);
        payload = jwt.verify(token, secretKey);
    } catch (error) {
        strapi.log.error("JWT verification failed:", error);
        throw new PolicyError("JWT verification failed", {
            policy: "is-admin",
        });
    }

    if (!payload) {
        throw new PolicyError("No authenticated user", {
            policy: "is-admin",
        });
    }

    if (payload.isAdmin === true) {
        return true;
    }

    throw new PolicyError("User is not an admin", {
        policy: "is-admin",
    });
};
