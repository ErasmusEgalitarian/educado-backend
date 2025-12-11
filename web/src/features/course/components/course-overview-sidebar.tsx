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

const OverviewSidebar = () => {
  const [dashboardActivities, setDashboardActivities] = useState<DashboardActivity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getCcDashboardActivity();
      setDashboardActivities(data ?? []);
    };
    fetchActivities();
  }, []);
  return (
    <div className="w-2/7 hidden xl:block">
      <div className="text-greyscale-text-body">
        {/* Greeting */}
        <h2 className="text-3xl font-semibold">Olá, User Name</h2>
        <p>Mocked for now</p>
        <div className="h-px bg-greyscale-surface-default my-6" />

        {/* Progress header with period selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-greyscale-text-subtle">
            Progressos
          </h3>
          <Select defaultValue="mes">
            <SelectTrigger className="w-[180px] rounded-lg border border-greyscale-border-disabled bg-background text-sm text-greyscale-text-body">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Esse mês</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {/* Total cursos */}
          <div>
            <p className="text-greyscale-text-subtle">Total cursos</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">8</span>
              <span className="text-success-surface-default text-sm flex items-center">
                <span aria-hidden="true" className="leading-none">
                  ▲
                </span>{" "}
                5%
              </span>
            </div>
          </div>

          {/* Total alunos */}
          <div>
            <p className="text-greyscale-text-subtle">Total alunos</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">167</span>
              <span className="text-error-surface-default text-sm flex items-center">
                <span aria-hidden="true" className="leading-none">
                  ▼
                </span>{" "}
                5%
              </span>
            </div>
          </div>

          {/* Total certificados emitidos */}
          <div>
            <p className="text-greyscale-text-subtle">
              Total certificados emitidos
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">54</span>
              <span className="text-success-surface-default text-sm flex items-center">
                <span aria-hidden="true" className="leading-none">
                  ▲
                </span>{" "}
                5%
              </span>
            </div>
          </div>

          {/* Avaliação */}
          <div>
            <p className="text-greyscale-text-subtle">Avaliação</p>
            <StarRating rating={3.7} size="md" />
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
