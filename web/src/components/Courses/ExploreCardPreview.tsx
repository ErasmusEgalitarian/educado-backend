import {
  mdiCalendarMonth,
  mdiCellphoneLink,
  mdiCertificateOutline,
  mdiClockFast,
  mdiClockOutline,
  mdiComment,
  mdiRobotOutline,
  mdiBookshelf,
  mdiFinance,
  mdiMedicalBag,
  mdiScissorsCutting,
  mdiLaptop,
  mdiChevronDown,
  mdiStarOutline,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import React from "react";

import { useCourse } from "@contexts/courseStore";

import singleIcon from "../../assets/singleIcon.png";

interface CardLabelProps {
  title: string;
  icon: string;
  color?: string; // Add optional color prop
}

interface CustomRatingProps {
  rating: number;
}

const CardLabel: React.FC<CardLabelProps> = (
  { title, icon, color = "#4B5563" }, // default to gray-600
) => (
  <div className="flex items-center justify-start">
    <Icon path={icon} size={0.5} style={{ color }} />
    <span className="pl-1 text-xs" style={{ color }}>
      {title}
    </span>
  </div>
);

const determineCategory = (category: string): string => {
  switch (category) {
    case "personal finance":
      return "Finanças pessoais";
    case "health and workplace safety":
      return "Saúde e segurança no trabalho";
    case "sewing":
      return "Costura";
    case "electronics":
      return "Eletrônica";
    default:
      return "Outro";
  }
};

const determineIcon = (category: string): string => {
  switch (category) {
    case "personal finance":
      return mdiFinance;
    case "health and workplace safety":
      return mdiMedicalBag;
    case "sewing":
      return mdiScissorsCutting;
    case "electronics":
      return mdiLaptop;
    default:
      return mdiBookshelf;
  }
};

const formatHours = (number: number | undefined): string => {
  if (typeof number !== "number" || isNaN(number) || number <= 0)
    return "- Hora";
  return number <= 1 ? `${number} Hora` : `${number} Horas`;
};

const getDifficultyLabel = (lvl: number): string => {
  switch (lvl) {
    case 1:
      return "Iniciante";
    case 2:
      return "Intermediário";
    case 3:
      return "Avançado";
    default:
      return "Iniciante";
  }
};

const CustomRating: React.FC<CustomRatingProps> = ({ rating }) => (
  <div className="flex items-center">
    <span className="text-yellow-400 text-sm font-bold mr-0.5">
      {rating.toFixed(1)}
    </span>
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        path={mdiStarOutline}
        size={0.5}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"}
      />
    ))}
  </div>
);

interface FeatureItem {
  icon: string;
  text: string;
}

const ExploreCardPreview: React.FC = () => {
  const { course } = useCourse();
  const features: FeatureItem[] = [
    {
      icon: mdiClockOutline,
      text: `${course.estimatedHours ?? 0 + "-"} horas de conteúdo (vídeos, exercícios, leituras complementares)`,
    },
    { icon: mdiCertificateOutline, text: "Certificado de Conclusão" },
    { icon: mdiClockFast, text: "Início imediato" },
    { icon: mdiCalendarMonth, text: "Acesso total por 1 ano" },
    {
      icon: mdiRobotOutline,
      text: "Chat e suporte com inteligência artificial",
    },
    { icon: mdiComment, text: "Acesso a comunidade do curso" },
    { icon: mdiCellphoneLink, text: "Assista onde e quando quiser!" },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Container for both card and modal */}
      <div className="bg-gray-100 rounded-lg p-2 h-full">
        {/* Explorer Card */}
        <div className="w-full opacity-50 h-fit px-2 items-center justify-start flex flex-col pt-[20%]">
          <div className="w-full h-fit flex items-center justify-start flex-row">
            <img src={singleIcon} alt="Icon" className="w-5 h-5 mr-1" />
            <text className="text-xl font-bold">Explorar cursos</text>
          </div>
          <text className="text-[10px]">
            {" "}
            Inscreva-se nos cursos do seu interesse e comece sua jornada{" "}
          </text>
        </div>

        {/* Modal */}
        {
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg">
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-50 rounded-t-[20px] p-3 h-[81%] overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-projectBlack font-medium text-2xl">
                  {course.title}
                </h2>
                <button className="rounded-full p-0.5 transition-colors cursor-default">
                  <Icon path={mdiChevronDown} size={0.8} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-2 h-full">
                {/* Course Labels */}
                <div className="flex flex-wrap gap-1">
                  <CardLabel
                    title={determineCategory(course.category)}
                    icon={determineIcon(course.category)}
                  />
                  <CardLabel
                    title={formatHours(course.estimatedHours)}
                    icon={mdiClockOutline}
                  />
                  <CardLabel
                    title={getDifficultyLabel(course.difficulty)}
                    icon={mdiBookshelf}
                  />
                </div>

                {course.rating !== undefined && (
                  <CustomRating rating={course.rating} />
                )}

                <div className="h-px bg-gray-200 w-full" />

                {/* Description */}
                {course.description !== "" && (
                  <p className="text-projectBlack text-xs overflow-y-auto whitespace-normal h-[5rem] pr-1 break-words">
                    {course.description}
                  </p>
                )}

                {/* Features */}
                <div className="border border-gray-300 rounded-xl p-2 space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-0.5">
                      <Icon
                        path={feature.icon}
                        size={0.4}
                        className="text-gray-500"
                      />
                      <span className="text-[8px] text-gray-900">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Action Button */}
                <button className="w-full bg-[#166276] text-white py-2 rounded-lg text-xs cursor-default">
                  Inscrever-se agora
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ExploreCardPreview;
