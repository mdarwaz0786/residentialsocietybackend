import { useEffect, useState } from "react";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleSelect from "../../components/Input/SingleSelect";
import useCreate from "../../hooks/useCreate";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";

const CreateFlat = () => {
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { postData, response, postError } = useCreate("/api/v1/flat/create-flat");
  const { errors, setErrors, validate } = useFormValidation();
  const [form, setForm] = useState({
    flatNumber: "",
    floor: "",
    flatType: "",
    status: "Approved",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const validationRules = {
    flatNumber: { required: true, label: "Flat Number" },
    floor: { required: true, label: "Floor" },
    flatType: { required: true, label: "Flat Type" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) {
      return;
    };

    await postData(form, validToken, false);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Flat created");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (postError) {
      toast.error(postError);
    };
  }, [postError]);

  const flatType = [
    { _id: 1, flatType: "1BHK" },
    { _id: 1, flatType: "2BHK" },
    { _id: 1, flatType: "3BHK" },
    { _id: 1, flatType: "4BHK" },
    { _id: 1, flatType: "Studio" },
    { _id: 1, flatType: "Penthouse" },
    { _id: 1, flatType: "Other" },
  ];

  return (
    <FormWrapper title="Create New Flat" onSubmit={handleSubmit}>
      <Input
        label="Flat Number"
        name="flatNumber"
        value={form.flatNumber}
        onChange={handleChange}
        required
        error={errors.flatNumber}
        width="col-md-4"
      />
      <Input
        label="Floor"
        name="floor"
        value={form.floor}
        onChange={handleChange}
        required
        error={errors.floor}
        width="col-md-4"
      />
      <SingleSelect
        label="Flat Type"
        name="flatType"
        value={form.flatType}
        onChange={handleChange}
        options={flatType || []}
        optionValue="flatType"
        optionKey="flatType"
        required
        error={errors.flatType}
        width="col-md-4"
      />
    </FormWrapper>
  );
};

export default CreateFlat;
