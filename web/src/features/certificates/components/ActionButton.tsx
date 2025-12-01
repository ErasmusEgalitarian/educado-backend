import { Icon } from "@mdi/react";

interface PropTypes {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: string;
  id?: string;
}

const ActionButton = (props: Readonly<PropTypes>) => {
  return (
    <button
      id={props.id}
      className="std-button rounded-lg px-7 cursor-pointer"
      onClick={props.onClick}
    >
      {props.children}
      {props.icon != null ? (
  <Icon path={props.icon} className="w-6 h-6 text-white float-right" />
) : null}
    </button>
  );
};

export default ActionButton;
