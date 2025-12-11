import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { Icon } from "@mdi/react";

interface PropsType {
 readonly id?: string;
 readonly passwordVisible: boolean;
 readonly togglePasswordVisibility: () => void;
}

const PasswordEye: React.FC<PropsType> = ({
  id,
  passwordVisible,
  togglePasswordVisibility,
}: PropsType) => {
  return (
    <button
      id={id}
      type="button"
      className="absolute right-3 bottom-[0.65rem]"
      onClick={togglePasswordVisibility}
    >
      <Icon
        path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
        size={1}
        color="#A1ACB2"
      />
    </button>
  );
};

export default PasswordEye;
