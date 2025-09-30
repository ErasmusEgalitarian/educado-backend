import { mdiAccount, mdiChevronDown, mdiDownload, mdiFileEye } from "@mdi/js";
import { Icon } from "@mdi/react";
import axios from "axios";
import { useEffect, useState } from "react";

import categories from "@/course/types/courseCategories";
import { CERT_URL } from "@/shared/config/environment";

import StarRating from "../../../shared/components/StarRating";
import { Certificate } from "../types/Certificate";

import ActionButton from "./ActionButton";
import CertificateField from "./CertificateField";

export default function CertificateCard(props: {
  certificate: Certificate;
  num: number;
}) {
  const { certificate } = props;
  const { course } = certificate;
  const maxTitleLength = 20;

  const [isOpen, setIsOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [pdfPath, setPdfPath] = useState("");

  function toggleModal() {
    setPreviewVisible(!previewVisible);
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    axios
      .post(
        CERT_URL +
          "/api/student-certificates/download?courseId=" +
          certificate.course._id +
          "&studentId=" +
          certificate.creator._id
      )
      .then((res) => {
        setPdfPath(res.data);
      });
  }, []);

  function download() {
    window.open(CERT_URL + pdfPath, "_blank");
  }

  return (
    <div className="overflow-hidden w-full m-auto duration-200 shadow-md rounded-xl hover:shadow-lg group">
      <div className="bg-white w-full">
        <div className="mt-5 grid grid-cols-[50fr,1fr] rounded-xl border">
          {/* Card info */}
          <div className="px-5 py-6 grid grid-cols-4 justify-space-between -mr-20">
            {/* Course title */}
            <h3
              className="text-xl font-semibold"
              id={"card-" + props.num + "-title"}
            >
              {course.title?.length <= maxTitleLength
                ? course.title
                : course.title?.slice(0, maxTitleLength - 2) + "..."}
            </h3>
            {/* Course category */}
            <CertificateField
              className="hidden xl:inline-block"
              icon={
                categories[course.category]?.icon ?? categories.default.icon
              }
            >
              <p>{categories[course.category]?.br ?? course.category}</p>
            </CertificateField>
            {/* Course rating */}
            <div className="">
              <StarRating rating={course.rating ?? 0} starSize="w-6" />
            </div>
            {/* Subsriber count */}
            <CertificateField icon={mdiAccount} className="">
              <p className="text-grayMedium">{course.numOfSubscriptions}</p>
              <p className="text-grayMedium hidden sm:inline-block ml-1">
                alunos
              </p>
            </CertificateField>
          </div>
          <button id={"dropdown-" + props.num} onClick={toggleDropdown}>
            <Icon
              path={mdiChevronDown}
              className="w-8 h-8 text-grayMedium hover:text-primary mr-5 float-right cursor-pointer"
            />
          </button>
          {isOpen && <div className="col-span-2 bg-grayLight h-[1px]" />}
          {isOpen && (
            <div className="w-full col-span-2 px-5 py-4 rounded-b-xl bg-[rgb(250,_250,_250)] grid grid-cols-2">
              {/** Export certificate */}
              <p className="text-xl translate-y-2 text-grayDark">
                Exportar certificado:{" "}
              </p>
              <div className="gap-20 flex flex-row-reverse ">
                <ActionButton
                  id={"download-button-" + props.num}
                  icon={mdiDownload}
                  onClick={download}
                >
                  <p>Baixar</p> {/** Download */}
                </ActionButton>
                <ActionButton
                  id={"preview-button-" + props.num}
                  icon={mdiFileEye}
                  onClick={toggleModal}
                >
                  <p> Previa </p> {/** Preview */}
                </ActionButton>
              </div>
              {previewVisible && (
                <object
                  id={"preview-window-" + props.num}
                  className="rounded-xl justify-self-center col-span-2 mt-4"
                  data={CERT_URL + pdfPath}
                  type="application/pdf"
                  width="600"
                  height="482"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
