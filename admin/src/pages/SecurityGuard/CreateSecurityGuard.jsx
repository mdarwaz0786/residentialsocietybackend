import { useEffect, useState } from "react";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import useCreate from "../../hooks/useCreate";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";

const CreateSecurityGuard = () => {
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { postData, response, postError } = useCreate("/api/v1/securityGuard/create-securityGuard");
  const { errors, setErrors, validate } = useFormValidation();
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    currentAddress: "",
    permanentAddress: "",
    profilePhoto: null,
    aadharCard: null,
    status: "Approved",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const handleImageChange = (file, name) => {
    setForm((f) => ({ ...f, [name]: file }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const validationRules = {
    fullName: { required: true, label: "Full Name" },
    mobile: { required: true, label: "Mobile" },
    email: { required: true, label: "Email" },
    password: { required: true, label: "Password" },
    currentAddress: { required: true, label: "Current Address" },
    permanentAddress: { required: true, label: "Permanent Address" },
    profilePhoto: { required: true, label: "Profile Photo" },
    aadharCard: { required: true, label: "Aadhar Card" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) {
      return;
    };

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    await postData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("security guard created");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (postError) {
      toast.error(postError);
    };
  }, [postError]);

  return (
    <FormWrapper title="Create Security Guard" onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        required
        error={errors.fullName}
        width="col-md-6"
      />
      <Input
        label="Mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        required
        error={errors.mobile}
        width="col-md-6"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        error={errors.email}
        width="col-md-6"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        error={errors.password}
        width="col-md-6"
      />
      <Input
        label="Current Address"
        name="currentAddress"
        value={form.currentAddress}
        onChange={handleChange}
        required
        error={errors.currentAddress}
        width="col-md-6"
      />
      <Input
        label="Permanent Address"
        name="permanentAddress"
        value={form.permanentAddress}
        onChange={handleChange}
        required
        error={errors.permanentAddress}
        width="col-md-6"
      />
      <SingleImage
        label="Profile Photo"
        name="profilePhoto"
        onChange={(file) => handleImageChange(file, "profilePhoto")}
        required
        error={errors.profilePhoto}
        width="col-md-6"
      />
      <SingleImage
        label="Aadhar Card"
        name="aadharCard"
        onChange={(file) => handleImageChange(file, "aadharCard")}
        required
        error={errors.aadharCard}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default CreateSecurityGuard;
