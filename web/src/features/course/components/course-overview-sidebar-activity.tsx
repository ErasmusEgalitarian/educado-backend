import { DashboardActivity } from "@/shared/api/types.gen";

export const SidebarActivity = ({ activity }: { activity: DashboardActivity }) => {

    return (
        <div className="pl-4 border-l-4 border-primary-border-default">
            <p>
                {activity.description}
            </p>
            <p>
                {activity.date?.split("T")[0]}
            </p>
        </div>
    )
}