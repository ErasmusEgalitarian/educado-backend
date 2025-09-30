import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { Icon } from "@mdi/react";

interface propsType {
  id?: string;
  passwordVisible: boolean;
  togglePasswordVisibility: () => void;
}

export default function PasswordEye(props: propsType) {
  return (
    <button
      id={props.id}
      type="button"
      className="absolute right-3 bottom-[0.65rem]"
      onClick={props.togglePasswordVisibility}
    >
      <Icon
        path={props.passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
        size={1}
        color="#A1ACB2"
      />
    </button>
  );
}
