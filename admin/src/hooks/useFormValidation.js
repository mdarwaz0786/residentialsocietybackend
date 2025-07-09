import { useState } from "react";
import { toast } from "react-toastify";

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (form, rules) => {
    const newErrors = {};

    for (const field in rules) {
      const value = form[field];
      const rule = rules[field];

      if (rule.required && !value) {
        newErrors[field] = `${rule.label} is required.`;
      };
    };

    setErrors(newErrors);
    Object.values(newErrors).forEach((err) => toast.error(err));

    return Object.keys(newErrors).length === 0;
  };

  return { errors, setErrors, validate };
};

export default useFormValidation;
