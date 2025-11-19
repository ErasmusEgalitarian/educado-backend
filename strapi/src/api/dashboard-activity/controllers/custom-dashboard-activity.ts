import { errorCodes } from "../../../helpers/errorCodes";
import jwt from "jsonwebtoken";

interface Dashboard_activity {
  description: string;
  date: Date;
}

export default {
  dashboardUserAction: async (ctx, next) => {
    try{
      // Extract the authenticated user from the policy context
      const secretKey = process.env.JWT_SECRET;
      const user = jwt.verify(ctx.headers.authorization.split("Bearer ")[1], secretKey) as ContentCreator;
      if(!user){
        throw "User is undefined";
      }
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
      let dashboard_activities : Dashboard_activity[] = [];
      for (const dashboard_activity of contentCreator.dashboard_activities){
        dashboard_activities.push({
          description: dashboard_activity.activityDesc, 
          date: new Date(dashboard_activity.updatedAt)
        });
      }

      ctx.response.body = dashboard_activities;
      
    } catch (err) {
        strapi.log.error("Dashboard activity GET failed:", err);
        ctx.response.status = 500;
        ctx.response.body = { error: errorCodes["E0019"] };
    }
  }
}