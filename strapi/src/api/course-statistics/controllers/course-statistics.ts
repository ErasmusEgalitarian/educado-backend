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
      const jwtCC = ctx.headers.authorization

      // Extract the authenticated user from the policy context
      // This object is populated by Strapi when the user is logged in
      const user_type = jwt.verify(jwtCC, secretKey) as ContentCreator;
      const courseIds : string[] = ctx.request.body.documentIds as string[];
      ctx.response.body = {
        courses: await getCoursesStats(user_type.documentId as string, courseIds),
        students: await getStudentStats(user_type.documentId as string, courseIds),
        certificates: await getCertificatesStats(user_type.documentId as string, courseIds),
        evaluation: await getContentCreatorFeedback(user_type.documentId as string) 
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};
export async function getCoursesStats(documentId: string, cIds: string[]) {
  try {
    //Find content creator and populate courses
    const creator = await strapi
      .documents("api::content-creator.content-creator")
      .findOne({
        documentId,
        populate: ["courses"],
      });
    if (!creator) {
      throw { error: errorCodes["E0504"] };
    }
    //filter courses
    const courses = filterCoursesBasedOnCid(creator.courses, cIds);
    //Statistic variables
    const total = courses.length;
    let count7 = 0;
    let count30 = 0;
    let countMonth = 0;
    //Dates
    const date7DaysAgo = new Date(Date.now() - DAYS_7_MS);
    const date30DaysAgo = new Date(Date.now() - DAYS_30_MS);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth());
    //Count stats
    for (const course of courses) {
      const createdAt = new Date(course.createdAt);
      if (createdAt > date7DaysAgo) count7++;
      if (createdAt > date30DaysAgo) count30++;
      if (createdAt > firstDayOfMonth) countMonth++;
    }
    return {
      total: total ?? 0,
      progress: {
        lastSevenDays:  Math.round((count7 / total) * 100) ?? 0,
        lastThirtyDays: Math.round((count30 / total) * 100) ?? 0,
        thisMonth:      Math.round((countMonth / total) * 100) ?? 0,
      },
    };
  } catch (err) {
    throw err;
  }
}
export async function getStudentStats(documentId: string, cIds: string[]) {
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
  let countTotal = user.courses.length;
  let count7 = 0;
  let count30 = 0;
  let countMonth = 0;
  const filteredCourses = filterCoursesBasedOnCid(user.courses, cIds);  //Filter courses
  // double for loop running counting all students on each course, and counting each based on enrollmentDate thorugh 3 if statements
  for (const course of filteredCourses) {
    for (const courseRelation of course.course_relations) {
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
    total: countTotal ?? 0, 
    progress: {
      lastThirtyDays: Math.round((count30/(countTotal-count30))*100) ?? 0, 
      lastSevenDays:  Math.round((count7/(countTotal-count7))*100) ?? 0, 
      thisMonth:      Math.round((countMonth/(countTotal-countMonth))*100)?? 0
    } 
  }
}
export async function getCertificatesStats(documentId: string, cIds: string[] = []) {
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

    // Filter courses based on provided cIds and extract their documentIds
    const filteredCourses = filterCoursesBasedOnCid(creator.courses, cIds);
    const courseIds = filteredCourses.map((c) => c.documentId); 
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
      total: countTotal ?? 0,
      progress: {
        lastThirtyDays: Math.round((count30/(countTotal-count30))*100) ?? 0, 
        lastSevenDays: Math.round((count7/(countTotal-count7))*100) ?? 0, 
        thisMonth: Math.round((countMonth/(countTotal-countMonth))*100) ?? 0
      }
    };
  } catch (err) {
    throw err;
  }
}

export async function getContentCreatorFeedback(documentId: string) {
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
      throw { error: errorCodes['E0504'] }
    }

    // Aggregate feedbacks & time variations
    let totalFeedbacks = 0, totalRating = 0;
    let count7dFeedbacks = 0, count7dRating = 0;
    let count30dFeedbacks = 0, count30dRating = 0;
    let countCurrentMonthFeedbacks = 0, countCurrentMonthRating = 0;

    for (const course of user.courses) {
      const feedbacks = course.feedbacks;
      for (const feedback of feedbacks) {
        totalFeedbacks++;
        totalRating += feedback.rating;

        //30 days
        if (
          new Date(feedback.dateCreated) >
          new Date(Date.now() - DAYS_30_MS)
        ) {
          count30dFeedbacks++;
          count30dRating += feedback.rating;
        }
        //7 days
        if (
          new Date(feedback.dateCreated) >
          new Date(Date.now() - DAYS_7_MS)
        ) {
          count7dFeedbacks++;
          count7dRating += feedback.rating;
        }
        //Month
        if (
          new Date(feedback.dateCreated) >
          new Date(new Date().getFullYear(), new Date().getMonth())
        ) {
          countCurrentMonthFeedbacks++;
          countCurrentMonthRating += feedback.rating;
        }
      }
    }

    const Totalaverage = totalFeedbacks != 0 ? totalRating / totalFeedbacks : 0;
    const Totalaverage7dProgress = totalFeedbacks - Totalaverage != 0 ? count7dRating / count7dFeedbacks - Totalaverage : 0;
    const Totalaverage30dProgress = count30dFeedbacks - Totalaverage != 0 ? count30dRating / count30dFeedbacks - Totalaverage : 0;
    const TotalaverageCurrentMonthProgress = countCurrentMonthFeedbacks - Totalaverage != 0 ? countCurrentMonthRating / countCurrentMonthFeedbacks - Totalaverage : 0;
    
    return {
      total: Number(Totalaverage.toFixed(1)),
      progress: {
        thisMonth: Number(TotalaverageCurrentMonthProgress.toFixed(1)),
        lastSevenDays: Number(Totalaverage7dProgress.toFixed(1)),
        lastThirtyDays: Number(Totalaverage30dProgress.toFixed(1))
      }
    };

  } catch (err) {
    throw { error: errorCodes['E0001'] }
  }
}


//Uses any[] on purpose, as it avoids parsing to helper type, and the filter function should be able to filter any type of array aslong as it has courseIds
function filterCoursesBasedOnCid(courses : any[], courseIds : string[]){
  if (courseIds.length == 0){
    return [];
  }
  let filteredCourses : any[] = [];
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
