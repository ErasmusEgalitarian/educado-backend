import { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { PolicyError } = errors;

const rateLimitMap = new Map<string, { count: number; startTime: number }>();

const RATE_LIMIT = 100; // Maximum number of requests
const TIME_WINDOW = 60000; // Time window in milliseconds (1 minute)

export default async (
  policyContext: any,
  config: any,
  { strapi }: { strapi: Core.Strapi }
) => {
  const ip = policyContext.request.ip;
  const currentTime = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: currentTime });
  } else {
    const { count, startTime } = rateLimitMap.get(ip)!;
    if (currentTime - startTime < TIME_WINDOW) {
      if (count >= RATE_LIMIT) {
        throw new PolicyError("Too many requests, please try again later.", {
          policy: "rate-limit",
        });
      }
      rateLimitMap.set(ip, { count: count + 1, startTime });
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: currentTime });
    }
  }

  return true;
};