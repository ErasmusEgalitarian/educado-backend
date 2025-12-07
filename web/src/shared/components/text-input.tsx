import React from "react";

interface PropTypes {
  readonly id?: string;
  readonly placeholder?: string;
  readonly label?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly className?: string;
  readonly hidePassword?: boolean;
}

/**
 *
 * @param {PropTypes} props properties of the component:
 * - `id` the id of the input (optional)
 * - `placeholder`: the placeholder of the input (optional)
 * - `label`: the label of the input (optional)
 * - `value`: the value of the input
 * - `onChange`: the function that sets the value of the input
 * - `className`: the class of the input (optional)
 * - `hidePassword`: boolean that indicates if the input is a password (optional (false by default))
 * @returns {React.JSX.Element} the text input component
 */
const TextInput= (props: Readonly<PropTypes>): React.JSX.Element => {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(event.target.value);
  }

  return (
    <>
      <label htmlFor="" className="-mb-5 ml-3 text-sm text-grayDark">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.hidePassword ? "password" : "email"}
        onChange={onChange}
        value={props.value}
        className={`w-full rounded-md mt-0 ${props.className ?? ""}`}
        placeholder={props.placeholder}
      />
    </>
  );
}

export default TextInput;
