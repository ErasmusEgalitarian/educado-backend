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
import { useTranslation } from "react-i18next";

const OverviewSidebar = () => {
  const { t, i18n } = useTranslation();
  const userInfo: userInfo = getUserInfo();
  return (
    <div className="w-2/7 hidden xl:block">
      <div className="text-greyscale-text-body">
        {/* Greeting */}
        <h2 className="text-3xl font-semibold">
          {t("courses.hello") + ` ${userInfo.firstName}`}
        </h2>
        <p>Mocked for now</p>
        <div className="h-px bg-greyscale-surface-default my-6" />

        {/* Progress header with period selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-greyscale-text-subtle">
            {t("courses.progress")}
          </h3>
          <Select defaultValue="mes">
            <SelectTrigger className="w-[180px] rounded-lg border border-greyscale-border-disabled bg-background text-sm text-greyscale-text-body">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">{t("courses.thisMonth")}</SelectItem>
              <SelectItem value="7d">{t("courses.lastSevenDays")}</SelectItem>
              <SelectItem value="30d">{t("courses.lastThirtyDays")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {/* Total cursos */}
          <div>
            <p className="text-greyscale-text-subtle">
              {t("courses.totalCourses")}
            </p>
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
            <p className="text-greyscale-text-subtle">
              {t("courses.totalStudents")}
            </p>
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
              {t("courses.totalCertificatesIssued")}
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
            <p className="text-greyscale-text-subtle">
              {t("courses.evaluation")}
            </p>
            <StarRating rating={3.7} size="md" />
          </div>
        </div>

        <Separator className="my-10" />

        {/* Atividades */}
        <div>
          <h3 className="text-2xl font-semibold text-greyscale-text-subtle mb-4">
            {t("courses.activities")}
          </h3>
          <div className="space-y-6">
            <div className="pl-4 border-l-4 border-primary-border-default">
              <p>
                Parabéns! Seu curso &quot;Nome do curso&quot; atingiu 100
                inscritos
              </p>
            </div>
            <div className="pl-4 border-l-4 border-primary-border-default">
              <p>
                Um aluno do curso &quot;Nome do curso&quot; deixou uma dúvida
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewSidebar;
