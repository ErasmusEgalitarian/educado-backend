const AcademicExperience = ({ data }: { data: unknown }) => {
  return (
    <div className="bg-secondary px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 space-x-8">
      <dt className="text-lg font-bold font-['Montserrat'] text-gray-900">
        Experiência Acadêmica: {/* Academic Experience*/}
      </dt>
      <div /> {/* Spacing */}
      <dd
        id="academicLevel"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Formação: {/* Acadamic level */}
        </span>
        {data.data.application.academicLevel}
      </dd>
      <dd
        id="academicStatus"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0 "
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Status: {/* Acadamic status */}
        </span>
        {data.data.application.academicStatus}
      </dd>
      <dd
        id="major"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Curso: {/* Major */}
        </span>
        {data.data.application.major}
      </dd>
      <dd
        id="institution"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Instituição: {/* Institution */}
        </span>
        {data.data.application.institution}
      </dd>
      <dd
        id="educationStartDate"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Início: {/* Education Start Date */}
        </span>
        {data.data.application.educationStartDate}
      </dd>
      <dd
        id="educationEndDate"
        className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0"
      >
        <span className="text-lg font-bold font-['Montserrat'] text-gray-900 m-2">
          Fim: {/* Education End Date */}
        </span>
        {data.data.application.educationEndDate}
      </dd>
    </div>
  );
};

export default AcademicExperience;
