//strapi/src/api/course-statistics/controllers/course-statistics.ts
/**
 * A set of functions called "actions" for `course-statistics`
 */
import { errorCodes } from "../../../helpers/errorCodes";
import jwt, { JwtPayload } from "jsonwebtoken"

export default {
  statisticsAction: async (ctx, next) => {
    try {
      const secretKey = process.env.JWT_SECRET;


      /* MOCK JWT INSTEAD OF GETTING IT FROM HEADER */
        const CC = await strapi.documents('api::content-creator.content-creator').findFirst(
          {
            filters: {
              firstName: "Mama"
            }
          }
        );
        const CC_type : ContentCreator = {
          documentId: CC.documentId,
          name: CC.firstName,
          email: CC.email,
          verifiedAt: new Date(CC.verifiedAt)
        }
        const jwtCC = jwt.sign(CC_type, secretKey);



      // Extract the authenticated user from the policy context
      // This object is populated by Strapi when the user is logged in
      const user_type = jwt.verify(jwtCC, secretKey) as ContentCreator;

    
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};


async function getStudetStats(documentId : string){
    // Find Content Creator
  const user = await strapi.documents('api::content-creator.content-creator').findFirst(
    {
      populate: {
        courses: {
          populate: ["course_relations"]
        }
      },
      filters: {
        documentId: documentId
      }
    }
  );
  if (!user) {
    throw { error: errorCodes['E0504'] }
  }
  console.log(user);

  let count = 0;
  for ( const course of user.courses ) {
    for ( const courseRelation of course.course_relations){
      count++;
      //checkDate
    }
  }
}

async function getCertificates(documentId : string) {

  try {
      const creator = await strapi
        .documents("api::content-creator.content-creator")
        .findOne({
          documentId: documentId,
          populate: ["courses"],
        });

      if (!creator) {
        throw { error: errorCodes["E0013"] };
        return;
      }

      const courseIds = creator.courses.map((c) => c.documentId);
      const totalCertificates = await strapi
        .documents("api::certificate.certificate")
        .count({
          filters: { course: { documentId: { $in: courseIds } } },
        });

      return { documentId, totalCertificates };
  }catch (err) {
    throw err;
  }
}

