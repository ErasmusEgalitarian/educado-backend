import { Icon } from "@mdi/react";

interface PropTypes {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

const CertificateField = (props: Readonly<PropTypes>) => {
  return (
    <div className={props.className ?? ""}>
      <div className="flex flex-row">
        {props.icon && (
          <Icon path={props.icon} className="w-6 mr-1 inline-block" />
        )}
        {props.children}
      </div>
    </div>
  );
};

export default CertificateField;
