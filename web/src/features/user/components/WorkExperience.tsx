import { useTranslation } from "react-i18next";

const WorkExperience = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white px-4 py-3 grid sm:grid-cols-2 sm:gap-4 sm:px-6 space-x-8">
      <dt className="text-lg font-bold font-['Montserrat']  text-gray-900">
        Experiência profissional: {/** Professional Experience*/}
      </dt>
      <div /> {/* spacing */}
      <dd
        id="company"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Empresa: {/* company */}
        </span>
        {data.data.application.company}
      </dd>
      <dd
        id="position"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Cargo: {/* position */}
        </span>
        {data.data.application.position}
      </dd>
      <dd
        id="workStartDate"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Início: {/* work Start Date */}
        </span>
        {data.data.application.workStartDate}
      </dd>
      <dd
        id="workEndDate"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Fim: {/* work end Date */}
        </span>
        {data.data.application.workEndDate}
      </dd>
      <dd
        id="workActivities"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          {t("courses.activities")}:
        </span>
        {data.data.application.workActivities}
      </dd>
    </div>
  );
};

export default WorkExperience;
