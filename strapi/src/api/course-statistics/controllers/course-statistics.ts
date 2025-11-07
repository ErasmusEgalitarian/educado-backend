//strapi/src/api/course-statistics/controllers/course-statistics.ts
/**
 * A set of functions called "actions" for `course-statistics`
 */
import { errorCodes } from "../../../helpers/errorCodes";
import jwt, { JwtPayload } from "jsonwebtoken";
const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;
const DAYS_7_MS = 7 * 24 * 60 * 60 * 1000;

export default {
  statisticsAction: async (ctx, next) => {
    try {
      const secretKey = process.env.JWT_SECRET;

      /* MOCK JWT INSTEAD OF GETTING IT FROM HEADER */
      const CC = await strapi
        .documents("api::content-creator.content-creator")
        .findFirst({
          filters: {
            firstName: "ed",
          },
        });
      // Define the ContentCreator type
      const CC_type: ContentCreator = {
        documentId: CC.documentId,
        firstName: CC.firstName,
        lastName: CC.lastName,
        email: CC.email,
        verifiedAt: new Date(CC.verifiedAt),
      };
      const jwtCC = jwt.sign(CC_type, secretKey);

      // Extract the authenticated user from the policy context
      // This object is populated by Strapi when the user is logged in
      const user_type = jwt.verify(jwtCC, secretKey) as ContentCreator;

      ctx.response.body = {
        courses: null, // TODO getCourses()
        students: await getStudentStats(user_type.documentId as string, []),
        certificates: 20, // TODO getCertificates()
        evaluation: await getContentCreatorFeedback(user_type.documentId as string, ctx) 
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

export async function getStudentStats(documentId: string, cIds: []) {
  // Find Content Creator
  const user = await strapi
    .documents("api::content-creator.content-creator")
    .findFirst({
      populate: {
        courses: {
          populate: ["course_relations"],
        },
      },
      filters: {
        documentId: documentId,
      },
    });
  if (!user) {
    throw { error: errorCodes["E0504"] };
  }

  // Declare and initialise all varibles hosting the statistics
  let countTotal = 0;
  let count7 = 0;
  let count30 = 0;
  let countMonth = 0;
  const filteredCourses = filterCoursesBasedOnCid(user.courses, cIds);  //Filter courses
  for (const course of filteredCourses) {
    for (const courseRelation of course.course_relations) {
      countTotal++;
      //30 days
      if (
        new Date(courseRelation.enrollmentDate) >
        new Date(Date.now() - DAYS_30_MS)
      ) {
        count30++;
      }
      //7 days
      if (
        new Date(courseRelation.enrollmentDate) >
        new Date(Date.now() - DAYS_7_MS)
      ) {
        count7++;
      }
      //Month
      if (
        new Date(courseRelation.enrollmentDate) >
        new Date(new Date().getFullYear(), new Date().getMonth())
      ) {
        countMonth++;
      }
    }
  }

  return { 
    total: countTotal, 
    progress: {
      lastThirtyDays: Math.round((count30/(countTotal-count30))*100), 
      lastSevenDays: Math.round((count7/(countTotal-count7))*100), 
      thisMonth: Math.round((countMonth/(countTotal-countMonth))*100)
    } 
  }
}
export async function getCertificatesStats(documentId: string) {
  try {
    const creator = await strapi
      .documents("api::content-creator.content-creator")
      .findOne({
        documentId: documentId,
        populate: ["courses"],
      });

    if (!creator) {
      throw { error: errorCodes["E0013"] };
    }

    let courseIds = creator.courses.map((c) => c.documentId);
    // Fetch certificates for the creator's courses
    const certificates = await strapi
      .documents("api::certificate.certificate")
      .findMany({
        filters: {
          course: { documentId: { $in: courseIds } }, // Filter by the creator's courses
        },
        fields: ["completionDate"], // Only fetch the createdAt field
      });

    let countTotal = certificates.length;
    let countMonth = 0;
    let count7 = 0;
    let count30 = 0;

    const date30DaysAgo = new Date(Date.now() - DAYS_30_MS);
    const date7DaysAgo = new Date(Date.now() - DAYS_7_MS);
    // Timestamp for the first day of the current month (e.g., Nov 1, 2025, 00:00:00)
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth());

    for (const cert of certificates) {
      const issueTime = new Date(cert.completionDate);

      // 30 days
      if (issueTime > date30DaysAgo) {
        count30++;
      }
      // 7 days (Last week)
      if (issueTime > date7DaysAgo) {
        count7++;
      }
      // This Month
      if (issueTime > firstDayOfMonth) {
        countMonth++;
      }
    }

    return {
      total: countTotal,
      progress: {
        lastThirtyDays: Math.round((count30/(countTotal-count30))*100), 
        lastSevenDays: Math.round((count7/(countTotal-count7))*100), 
        thisMonth: Math.round((countMonth/(countTotal-countMonth))*100)
      }
    };
  } catch (err) {
    throw err;
  }
}

 async function getContentCreatorFeedback(documentId : string, ctx){

  try {
      // Find Content Creator and related Course feedbacks
      const user = await strapi.documents('api::content-creator.content-creator').findFirst(
          {
          populate: {
              courses: {
              populate: ["feedbacks"]
              }
          },
          filters: {
              documentId: documentId
          }
          }
      );
      if (!user) {
          ctx.status = 404;
          ctx.body = { error: errorCodes['E0504'] }
      }

      // Aggregate feedbacks
      let totalFeedbacks = 0;
      let totalRating = 0;

      for (const course of user.courses) {
        const feedbacks = course.feedbacks;
        for (const feedback of feedbacks) {
          totalFeedbacks++;
          totalRating += feedback.rating;
      }
  } 

  const Totalaverage = totalRating / totalFeedbacks;

  return {
      total: Number(Totalaverage.toFixed(1)),
      progress: {
        thisMonth: 25,        
        lastSevenDays: 10,    
        lastThirtyDays: 30
        }
      }; 
  
  } catch (err) {
      ctx.status = 500;
      ctx.body = { error: errorCodes['E0001'] }
  }
}






//Maybe remove :any[] (but the helper type would be very large, and difficult to maintain)
function filterCoursesBasedOnCid(courses : any[], courseIds : string[]){
  if (courseIds.length == 0){
    return [];
  }
  let filteredCourses : any[];
  //Filter courses
  for (const course of courses){
    for (const cId of courseIds){
      if(cId == course.documentId){
        filteredCourses.push(course);
        break;
      }
    }
  }
  return filteredCourses;
}
