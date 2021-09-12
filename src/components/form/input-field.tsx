import { Field } from "formik";
const InputField = ({
  type = "text",
  placeholder,
  label,
  name,
  errors,
  touched,
}) => {
  return (
    <div className="m-4 flex flex-col w-1/6">
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="border outline-none"
        name={name}
        placeholder={placeholder}
      />
      {errors[name] && touched[name] ? (
        <div className="text-xs text-red-500">{errors[name]}</div>
      ) : null}
    </div>
  );
};

export default InputField;
