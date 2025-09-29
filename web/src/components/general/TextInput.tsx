import React from 'react';

type propTypes = {
  id?: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  hidePassword?: boolean;
}

/**
 * 
 * @param {propTypes} props properties of the component:
 * - `id` the id of the input (optional)
 * - `placeholder`: the placeholder of the input (optional)
 * - `label`: the label of the input (optional)
 * - `value`: the value of the input
 * - `onChange`: the function that sets the value of the input
 * - `className`: the class of the input (optional)
 * - `hidePassword`: boolean that indicates if the input is a password (optional (false by default))
 * @returns {JSX.Element} the text input component
 */
export default function TextInput(props: propTypes) : JSX.Element {

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(event.target.value);
  }

  return (
    <>
      <label htmlFor="" className="-mb-5 ml-3 text-sm text-grayDark">{props.label}</label>
      <input id={props.id} type={props.hidePassword ? 'password' : 'email'} onChange={onChange}  value={props.value} className={"w-full rounded-md mt-0" + props.className} placeholder={props.placeholder} />
    </>

  );
}