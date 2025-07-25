import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";
import usePatch from "../../hooks/usePatch";

const UpdateSecurityGuard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data } = useFetch(`/api/v1/securityGuard/get-single-securityGuard/${id}`, validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/securityGuard/update-securityGuard/${id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    gateNumber: "",
    password: "",
    currentAddress: "",
    permanentAddress: "",
    profilePhoto: null,
    aadharCard: null,
  });

  useEffect(() => {
    if (data?.data) {
      const { fullName, mobile, email, gateNumber, currentAddress, permanentAddress, aadharCard, profilePhoto } = data.data;
      setForm({
        fullName: fullName,
        mobile: mobile,
        email: email,
        gateNumber: gateNumber,
        password: "",
        currentAddress: currentAddress,
        permanentAddress: permanentAddress,
        profilePhoto: profilePhoto,
        aadharCard: aadharCard,
      });
    };
  }, [data]);

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
    gateNumber: { required: true, label: "Gate Number" },
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
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      if ((key === "profilePhoto") && typeof value === "string") return;
      if ((key === "aadharCard") && typeof value === "string") return;
      if (value !== null) formData.append(key, value);
    });

    await updateData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Security guard updated");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  return (
    <FormWrapper title="Update Security Guard" onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        required
        error={errors.fullName}
        width="col-md-4"
      />
      <Input
        label="Mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        required
        error={errors.mobile}
        width="col-md-4"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        error={errors.email}
        width="col-md-4"
      />
      <Input
        label="Gate Number"
        name="gateNumber"
        type="text"
        value={form.gateNumber}
        onChange={handleChange}
        required
        error={errors.gateNumber}
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
        value={form.profilePhoto}
        required
        error={errors.profilePhoto}
        width="col-md-6"
      />
      <SingleImage
        label="Aadhar Card"
        name="aadharCard"
        onChange={(file) => handleImageChange(file, "aadharCard")}
        value={form.aadharCard}
        required
        error={errors.aadharCard}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default UpdateSecurityGuard;
