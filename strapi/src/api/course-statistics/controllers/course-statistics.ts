//strapi/src/api/course-statistics/controllers/course-statistics.ts
/**
 * A set of functions called "actions" for `course-statistics`
 */
import { errorCodes } from "../../../helpers/errorCodes";
import jwt, { JwtPayload } from "jsonwebtoken";

const DAYS_30_MS = 30*24*60*60*1000;
const DAYS_7_MS = 7*24*60*60*1000;

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

      
      ctx.response.body = { 
        courses: null, // TODO getCourses()
        students: await getStudentStats(user_type.documentId as string),
        certificates: null, // TODO getCertificates()
        evaluation: null // TODO getEvaluation()
      };

    
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};


async function getStudentStats(documentId : string){
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

  let countTotal = 0;
  let count7 = 0;
  let count30 = 0;
  let countMonth = 0;
  //Filter courses TODO
  for ( const course of user.courses ) {
    for ( const courseRelation of course.course_relations){
      countTotal++;
      //30 days
      if (new Date(courseRelation.enrollmentDate) > new Date(Date.now()-DAYS_30_MS)) {
        count30++;
      }
      //7 days
      if (new Date(courseRelation.enrollmentDate) > new Date(Date.now()-DAYS_7_MS)) {
        count7++;
      }
      //Month
      if (new Date(courseRelation.enrollmentDate) > new Date(new Date().getFullYear(), new Date().getMonth())) {
        countMonth++;
      }
    }
  }

  return { total: countTotal, progress: {
    lastThirtyDays: ((count30/(countTotal-count30))*100), 
    lastSevenDays: ((count7/(countTotal-count7))*100), 
    thisMonth: ((countMonth/(countTotal-countMonth))*100)} 
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

