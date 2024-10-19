import React from 'react';
import { ErrorMessage, useField } from "formik";
import styled from "./styles.module.scss";

const AdminInput = ({ placeholder, label, className, as, ...props }) => {
  const [field, meta] = useField(props);

  const InputComponent = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div>
      <label
        className={`${styled.label} ${
          meta.touched && meta.error ? styled.inputError : ""
        } ${className ? styled[className] : ""} `}
      >
        <span>{label}</span>
        <InputComponent
          {...field}
          {...props}
          placeholder={placeholder}
          className={styled.input}
        />
      </label>
      {meta.touched && meta.error ? (
        <span className={styled.inputError__msg}>
          <ErrorMessage name={field.name} />
        </span>
      ) : (
        <span className={styled.inputError__skeleton}></span>
      )}
    </div>
  );
};

export default AdminInput;