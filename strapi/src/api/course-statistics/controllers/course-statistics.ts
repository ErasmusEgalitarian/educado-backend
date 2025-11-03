//strapi/src/api/course-statistics/controllers/course-statistics.ts
/**
 * A set of functions called "actions" for `course-statistics`
 */

import jwt, { JwtPayload } from "jsonwebtoken";
import { errorCodes } from "../../../helpers/errorCodes";

export default {
  statisticsAction: async (ctx, next) => {
    try {
      const secretKey = process.env.JWT_SECRET;
      const user = jwt.verify(ctx.headers.authorization, secretKey);
      console.log(user);
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
  creatorCertificatesCount: async (ctx) => {
    const creatorId = ctx.params.id;

    try {
      const creator = await strapi
        .documents("api::content-creator.content-creator")
        .findOne({
          documentId: creatorId,
          populate: ["courses"],
        });

      if (!creator) {
        ctx.status = 404;
        ctx.body = { error: errorCodes["E0013"] };
        return;
      }

      const courseIds = creator.courses.map((c) => c.documentId);
      const totalCertificates = await strapi
        .documents("api::certificate.certificate")
        .count({
          filters: { course: { documentId: { $in: courseIds } } },
        });

      ctx.body = { creatorId, totalCertificates };
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};
