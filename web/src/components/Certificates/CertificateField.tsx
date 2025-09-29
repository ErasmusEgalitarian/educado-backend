import { Icon } from "@mdi/react";

interface propTypes {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export default function CertificateField(props: propTypes) {
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
}
