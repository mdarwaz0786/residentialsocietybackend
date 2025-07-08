import { useState } from "react";

const useFormFields = (initialValues = {}) => {
  const [fields, setFields] = useState(initialValues);

  const handleFieldChange = (e) => {
    const { name, type, value, checked, files, multiple } = e.target;

    if (type === "checkbox") {
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (multiple) {
        setFields((prev) => ({
          ...prev,
          [name]: Array.from(files),
        }));
      } else {
        setFields((prev) => ({ ...prev, [name]: files[0] }));
      };
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    };
  };

  const resetFields = () => {
    const reset = {};
    Object.keys(fields).forEach((key) => {
      const val = fields[key];
      reset[key] = Array.isArray(val) ? [] : typeof val === "boolean" ? false : "";
    });
    setFields(reset);
  };

  return { fields, handleFieldChange, resetFields, setFields };
};

export default useFormFields;
