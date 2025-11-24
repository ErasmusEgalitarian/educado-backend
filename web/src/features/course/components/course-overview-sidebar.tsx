import { useTranslation } from "react-i18next";
import { getUserInfo } from "@/auth/lib/userInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";
import { Separator } from "@/shared/components/shadcn/seperator";
import StarRating from "@/shared/components/star-rating";
import { SidebarActivity } from "../components/course-overview-sidebar-activity";
import { useEffect, useState } from "react";
import { getCcDashboardActivity } from "@/shared/api/sdk.gen";
import { DashboardActivity } from "@/shared/api/types.gen";
import { postCourseStatisticsStatisticsAction } from "@/shared/api/sdk.gen";
import { postCourseStatistics } from "@/shared/api/sdk.gen";
import { CourseStatisticsResponse } from "@/shared/api/types.gen";

type PeriodKey = "thisMonth" | "lastSevenDays" | "lastThirtyDays";

const OverviewSidebar = ({ documentIds }: { documentIds?: string[] }) => {
  const { t, i18n } = useTranslation();
  const userInfo: userInfo = getUserInfo();

  const [period, setPeriod] = useState<PeriodKey>("thisMonth");
  const [statistics, setStatistics] = useState<CourseStatisticsResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!documentIds || documentIds.length === 0) {
      setStatistics(undefined);
      setLoading(false);
      return;
    }

    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const data = await postCourseStatistics({
          body: {
            documentIds: documentIds
          },
        });
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };
      
    fetchStatistics();
  }, [documentIds, period]);

  const getProgress = (entity: keyof CourseStatisticsResponse): number => {
    if (!statistics) return 0;
    return statistics[entity].progress[period];
  };

  const getTotal = (entity: keyof CourseStatisticsResponse): number => {
    if (!statistics) return 0;
    return statistics[entity].total;
  }


  return (
    <div className="w-2/7 hidden xl:block">
      <div className="text-greyscale-text-body">
        {/* Greeting */}
        <h2 className="text-3xl font-semibold">
          {t("courses.hello") + ` ${userInfo.firstName}`}
        </h2>
        <p>{loading ? t("common.loading") : ""}</p>
        <div className="h-px bg-greyscale-surface-default my-6" />

        {/* Progress header with period selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-greyscale-text-subtle">
            Progressos
          </h3>
          <Select value={period} onValueChange={(val: PeriodKey) => {setPeriod(val)}}>
            <SelectTrigger className="w-[180px] rounded-lg border border-greyscale-border-disabled bg-background text-sm text-greyscale-text-body">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">{t("courses.thisMonth")}</SelectItem>
              <SelectItem value="lastSevenDays">{t("courses.lastSevenDays")}</SelectItem>
              <SelectItem value="lastThirtyDays">{t("courses.lastThirtyDays")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {/* Total cursos */}
          <div>
            <p className="text-greyscale-text-subtle">Total cursos</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{getTotal("courses")}</span>
                <span className={`text-sm flex item-center ${
                    getProgress("courses") >= 0
                      ? "text-success-surface-default"
                      : "text-error-surface-default"
                  }`}
                >
                  <span aria-hidden="true" className="leading-none">
                    {getProgress("courses") >= 0 ? "▲" : "▼"}
                </span>{" "}
                {Math.abs(getProgress("courses"))}%
              </span>
            </div>
          </div>

          {/* Total alunos */}
          <div>
            <p className="text-greyscale-text-subtle">Total alunos</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{getTotal("students")}</span>
              <span
               className={`text-sm flex item-center ${
                  getProgress("students") >= 0
                    ? "text-success-surface-default"
                    : "text-error-surface-default"
                }`}
              >
                <span aria-hidden="true" className="leading-none">
                  {getProgress("students") >= 0 ? "▲" : "▼"}
                </span>{" "}
                {Math.abs(getProgress("students"))}%
              </span>
            </div>
          </div>

          {/* Total certificados emitidos */}
          <div>
            <p className="text-greyscale-text-subtle">
              Total certificados emitidos
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{getTotal("certificates")}</span>
              <span
                className={`text-sm flex item-center ${
                  getProgress("certificates") >= 0
                    ? "text-success-surface-default"
                    : "text-error-surface-default"
                }`}
              >
                <span aria-hidden="true" className="leading-none">
                  {getProgress("certificates") >= 0 ? "▲" : "▼"}
                </span>{" "}
                {Math.abs(getProgress("certificates"))}%
              </span>
            </div>
          </div>

          {/* Avaliação */}
          <div>
            <p className="text-greyscale-text-subtle">
              {t("courses.evaluation")}
            </p>
            <div className="flex items-baseline gap-2">
                <StarRating rating={getTotal("evaluation")} size="md" />
                <span
                className={`text-sm flex item-center ${
                  getProgress("evaluation") >= 0
                    ? "text-success-surface-default"
                    : "text-error-surface-default"
                    }`}
                >
                  <span aria-hidden="true" className="leading-none">
                    {getProgress("evaluation") >= 0 ? "▲" : "▼"}
                  </span>{" "}  
                  {Math.abs(getProgress("evaluation"))}
                </span>
            </div>
            
          </div>
        </div>

        <Separator className="my-10" />

        {/* Atividades */}
        <div>
          <h3 className="text-2xl font-semibold text-greyscale-text-subtle mb-4">
            Atividades
          </h3>
          <div className="space-y-6">
            {dashboardActivities.map((activity) => (
              <SidebarActivity activity={activity} />
            ))}          
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewSidebar;
