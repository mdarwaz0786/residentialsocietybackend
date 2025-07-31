import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";
import SingleSelect from "../../components/Input/SingleSelect";
import usePatch from "../../hooks/usePatch";

const UpdateFlatOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data } = useFetch(`/api/v1/flatOwner/get-single-flatOwner/${id}`, validToken);
  const { data: flatData } = useFetch("/api/v1/flat/get-all-flat", validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/flatOwner/update-flatOwner/${id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    flat: "",
    currentAddress: "",
    permanentAddress: "",
    profilePhoto: null,
    aadharCard: null,
    allotment: null,
    vehicleRC: null,
  });

  useEffect(() => {
    if (data?.data) {
      const { fullName, mobile, email, flat, currentAddress, permanentAddress, profilePhoto, aadharCard, allotment, vehicleRC } = data.data;
      setForm({
        fullName: fullName,
        mobile: mobile,
        email: email,
        flat: flat?._id,
        password: "",
        currentAddress: currentAddress,
        permanentAddress: permanentAddress,
        profilePhoto: profilePhoto,
        aadharCard: aadharCard,
        allotment: allotment,
        vehicleRC: vehicleRC,
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
    flat: { required: true, label: "Flat" },
    currentAddress: { required: true, label: "Current Address" },
    permanentAddress: { required: true, label: "Permanent Address" },
    profilePhoto: { required: true, label: "Profile Photo" },
    aadharCard: { required: true, label: "Aadhar Card" },
    allotment: { required: true, label: "Allotment" },
    vehicleRC: { required: true, label: "Vehicle Rc" },
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
      if ((key === "allotment") && typeof value === "string") return;
      if ((key === "vehicleRC") && typeof value === "string") return;
      if (value !== null) formData.append(key, value);
    });

    await updateData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Flat owner updated");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  return (
    <FormWrapper title="Update Flat Owner" onSubmit={handleSubmit}>
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
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        error={errors.password}
        width="col-md-6"
      />
      <SingleSelect
        label="Flat"
        name="flat"
        value={form.flat}
        onChange={handleChange}
        options={flatData?.data || []}
        optionValue="flatNumber"
        optionKey="_id"
        required
        error={errors.flat}
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
      <SingleImage
        label="Allotment"
        name="allotment"
        onChange={(file) => handleImageChange(file, "allotment")}
        value={form.aadharCard}
        required
        error={errors.allotment}
        width="col-md-6"
      />
      <SingleImage
        label="Vehicle RC"
        name="vehicleRC"
        onChange={(file) => handleImageChange(file, "vehicleRC")}
        value={form.vehicleRC}
        required
        error={errors.vehicleRC}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default UpdateFlatOwner;
