//strapi/src/api/course-statistics/controllers/course-statistics.ts
/**
 * A set of functions called "actions" for `course-statistics`
 */
import { errorCodes } from "../../../helpers/errorCodes";
import jwt, { JwtPayload } from "jsonwebtoken";

//Custom types
interface CourseRelationType {
  enrollmentDate: Date;
}
interface FeedbackType {
  createdAt: Date;
  rating: number;
}
interface PopulatedCourse {
  documentId: string
  createdAt: Date;
  course_enrollment_relations: CourseRelationType[];
  feedbacks: FeedbackType[];
}

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;
const DAYS_7_MS = 7 * 24 * 60 * 60 * 1000;

export default {
  statisticsAction: async (ctx, next) => {
    try {
      // Extract the authenticated user from the policy context
      const user_type = jsonWebTokenVerify(ctx.headers.authorization as string) as ContentCreator;
      const courseIds : string[] = ctx.request.body.documentIds as string[];

      // Find Content Creator
      const user = await strapi
        .documents("api::content-creator.content-creator")
        .findFirst({
          populate: {
            courses: {
              populate: ["course_enrollment_relations", "feedbacks"],
            },
          },
          filters: {
            documentId: user_type.documentId as string,
          },
        });
      if (!user) {
        throw { error: errorCodes["E0004"] };
      }
      //Filter courses
      const filteredCourses = filterCoursesBasedOnCid(user.courses, courseIds) as PopulatedCourse[];  

      ctx.response.body = {
        courses: getCoursesStats(filteredCourses),
        students: getStudentStats(filteredCourses),
        certificates: await getCertificatesStats(filteredCourses),
        evaluation: getContentCreatorFeedback(filteredCourses) 
      };
      console.log(ctx.response.body);
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

export function getCoursesStats(filteredCourses : PopulatedCourse[]) {
  //Statistic variables
  const countTotal = filteredCourses.length;
  let count7 = 0;
  let count30 = 0;
  let countMonth = 0;
  //Dates
  const date7DaysAgo = new Date(Date.now() - DAYS_7_MS);
  const date30DaysAgo = new Date(Date.now() - DAYS_30_MS);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth());
  //Count stats
  for (const course of filteredCourses) {
    const createdAt = new Date(course.createdAt);
    if (createdAt > date7DaysAgo) count7++;
    if (createdAt > date30DaysAgo) count30++;
    if (createdAt > firstDayOfMonth) countMonth++;
  }
  return {
    total: countTotal,
    progress: {
      lastThirtyDays: numberSafetyCheck(Math.round((count30/(countTotal-count30))*100)), 
      lastSevenDays:  numberSafetyCheck(Math.round((count7/(countTotal-count7))*100)), 
      thisMonth:      numberSafetyCheck(Math.round((countMonth/(countTotal-countMonth))*100))
    },
  };
}

export function getStudentStats(filteredCourses : PopulatedCourse[]) {
  // Declare and initialise all varibles hosting the statistics
  let countTotal = 0;
  let count7 = 0;
  let count30 = 0;
  let countMonth = 0;

  // double for loop running counting all students on each course, and counting each based on enrollmentDate thorugh 3 if statements
  for (const course of filteredCourses) {
    for (const courseRelation of course.course_enrollment_relations) {
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
      lastThirtyDays: numberSafetyCheck(Math.round((count30/(countTotal-count30))*100)), 
      lastSevenDays:  numberSafetyCheck(Math.round((count7/(countTotal-count7))*100)), 
      thisMonth:      numberSafetyCheck(Math.round((countMonth/(countTotal-countMonth))*100))
    } 
  }
}

export async function getCertificatesStats(filteredCourses : PopulatedCourse[]) {
  try {
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
      new Date().getMonth()
    );

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
        lastThirtyDays: numberSafetyCheck(Math.round((count30/(countTotal-count30))*100)), 
        lastSevenDays: numberSafetyCheck(Math.round((count7/(countTotal-count7))*100)), 
        thisMonth: numberSafetyCheck(Math.round((countMonth/(countTotal-countMonth))*100))
      }
    };
  } catch (err) {
    throw err;
  }
}

export function getContentCreatorFeedback(filteredCourses : PopulatedCourse[]) {
  try {
    // Aggregate feedbacks & time variations
    let totalFeedbacks = 0, totalRating = 0;
    let count7dFeedbacks = 0, count7dRating = 0;
    let count30dFeedbacks = 0, count30dRating = 0;
    let countCurrentMonthFeedbacks = 0, countCurrentMonthRating = 0;

    for (const course of filteredCourses) {
      for (const feedback of course.feedbacks) {
        totalFeedbacks++;
        totalRating += feedback.rating;

        //30 days
        if (
          new Date(feedback.createdAt) >
          new Date(Date.now() - DAYS_30_MS)
        ) {
          count30dFeedbacks++;
          count30dRating += feedback.rating;
        }
        //7 days
        if (
          new Date(feedback.createdAt) >
          new Date(Date.now() - DAYS_7_MS)
        ) {
          count7dFeedbacks++;
          count7dRating += feedback.rating;
        }
        //Month
        if (
          new Date(feedback.createdAt) >
          new Date(new Date().getFullYear(), new Date().getMonth())
        ) {
          countCurrentMonthFeedbacks++;
          countCurrentMonthRating += feedback.rating;
        }
      }
    }
    const Totalaverage = totalRating / totalFeedbacks;
    const Totalaverage7dProgress = Totalaverage - (totalRating - count7dRating) / (totalFeedbacks - count7dFeedbacks);
    const Totalaverage30dProgress = Totalaverage - (totalRating - count30dRating) / (totalFeedbacks - count30dFeedbacks);
    const TotalaverageCurrentMonthProgress = Totalaverage - (totalRating - countCurrentMonthRating) / (totalFeedbacks - countCurrentMonthFeedbacks);
    
    return {
      total: Number(numberSafetyCheck(Totalaverage).toFixed(1)),
      progress: {
        thisMonth: Number(numberSafetyCheck(TotalaverageCurrentMonthProgress).toFixed(1)),
        lastSevenDays: Number(numberSafetyCheck(Totalaverage7dProgress).toFixed(1)),
        lastThirtyDays: Number(numberSafetyCheck(Totalaverage30dProgress).toFixed(1))
      }
    };

  } catch (err) {
    throw { error: errorCodes['E0001'] }
  }
}


// Uses generic, as it avoids parsing to helper type, and the filter function should be able to filter any type of array as long as it has courseIds
export function filterCoursesBasedOnCid <T extends { documentId: string }> (courses : T[], courseIds : string[]): T[] {
  if (courseIds.length == 0){
    return [];
  }

  //Filter courses
  let filteredCourses = courses.filter((course) => {
    return courseIds.some((cId) => cId === course.documentId)
  });
  
  return filteredCourses;
}

function jsonWebTokenVerify (jwtInput : string) {
  const secretKey = process.env.JWT_SECRET;
  //Splits Bearer
  let user : ContentCreator;
  try {
    // Extract the authenticated user from the policy context
    user = jwt.verify(jwtInput.split("Bearer ")[1], secretKey) as ContentCreator;
  } catch (error) {
    throw error;
  }
  return user;
}

function numberSafetyCheck(n : number) : number {
  //Returns 0 if the number fails the check
  if (n == null || Number.isNaN(n) || n == undefined){
    return 0;
  }
  return n;
}