import Layout from "../../../shared/components/Layout";
import CertificateList from "../components/CertificateList";

export default function Certificates() {
  return (
    <Layout meta="Certificates">
      <div className="h-[93%] align-self-center lg:px-20 xl:px-40">
        <div className="m-8 p-8 pb-0 bg-white rounded-xl overflow-hidden h-full">
          <CertificateList />
        </div>
      </div>
    </Layout>
  );
}
