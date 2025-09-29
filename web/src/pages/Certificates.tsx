import CertificateList from "../components/Certificates/CertificateList";
import Layout from "../components/Layout";

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
