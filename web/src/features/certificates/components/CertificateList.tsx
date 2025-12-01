import { useEffect, useState } from "react";

import EmptyImg from "@/shared/assets/no-courses.png";

import CertificateService from "../../../unplaced/services/certificate.services";
import { Certificate } from "../types/Certificate";

import CertificateCard from "./CertificateCard";
import EmptyState from "./CertificateEmpty";

const CertificateList = () => {
  const [certificates, setCertificates] = useState<Certificate[]>();

  useEffect(() => {
    void CertificateService.getUserCertificates(
      localStorage.getItem("id") ?? "",
    ).then((res: Certificate[]) => {
      setCertificates(res);
    });
  }, []);

  if (!certificates) return <EmptyState />;

  return (
    <div className="overflow-scroll min-h-full pb-4" id="certificate-list">
      {certificates.length > 0 ? (
        <>
          <div className="w-full">
            <h1 className="text-3xl font-semibold">Certificados</h1>
            <p className="text-grayMedium">
              Você tem {certificates.length} certificados.
            </p>
          </div>
          {certificates.map((certificate: Certificate, key: number) => (
            <CertificateCard certificate={certificate} key={key} num={key} />
          ))}
        </>
      ) : (
        <div className="grid place-content-center w-full h-full text-center">
          <div className="md:mx-40 xl:mx-64" id="no-certificates-message">
            <img src={EmptyImg} className="w-full" />
            <h1 className="text-xl font-bold my-4">Comece agora</h1>
            <p>
              Parece que você ainda não criou nenhum curso. Clique no botão
              abaixo para acessar sua página de cursos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateList;
