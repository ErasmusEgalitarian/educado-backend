import { errorCodes } from "../../../helpers/errorCodes";
import jwt from "jsonwebtoken";

interface Dashboard_activity {
  description: string;
  date: Date;
}

export default {
  dashboardUserAction: async (ctx, next) => {
    try{
      const user = getContentCreatorFromJWT(ctx.headers.authorization as string);
      //Finds the content creator on the backend
      const contentCreator = await strapi.documents('api::content-creator.content-creator').findFirst(
        {
          filters: {
            email: user.email as string
          },
          populate: {
            dashboard_activities: {
              sort: ['createdAt:desc']
            }
          }
        }
      );

      // Pushes all of the Dashboard activites to an array and returns said array.
      const dashboard_activities: Dashboard_activity[] = contentCreator.dashboard_activities.map(activity => ({
        description: activity.activityDesc,
        date: new Date(activity.updatedAt)
      }));

      ctx.response.body = dashboard_activities;
      
    } catch (err) {
        strapi.log.error("Dashboard activity GET failed:", err);
        ctx.response.status = 500;
        ctx.response.body = { error: errorCodes["E0019"] };
    }
  }
}

function getContentCreatorFromJWT(userJWT : string){
  // Extract the authenticated user from the policy context
  const secretKey = process.env.JWT_SECRET;
  const user = jwt.verify(userJWT.split("Bearer ")[1], secretKey) as ContentCreator;
  if(!user){
    throw "User is undefined";
  }
  return user;
}