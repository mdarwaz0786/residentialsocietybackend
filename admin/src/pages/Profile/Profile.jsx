/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../../components/Form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import useFetch from "../../hooks/useFetch";
import usePatch from "../../hooks/usePatch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";

const Profile = () => {
  const navigate = useNavigate();
  const { validToken, user } = useAuth();
  const { data: userData } = useFetch(`/api/v1/user/get-single-user/${user?._id}`, validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/user/update-user/${user?._id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    profilePhoto: null,
  });

  useEffect(() => {
    if (userData?.data) {
      const { fullName, mobile, email, profilePhoto } = user;
      setForm({
        fullName,
        mobile,
        email,
        password: "",
        profilePhoto,
      });
    };
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, profilePhoto: file }));
    setErrors((prev) => ({ ...prev, profilePhoto: "" }));
  };

  const validationRules = {
    fullName: { required: true, label: "Full Name" },
    mobile: { required: true, label: "Mobile" },
    email: { required: true, label: "Email" },
    profilePhoto: { required: true, label: "Profile Photo" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      if ((key === "profilePhoto") && typeof value === "string") return;
      if (value !== null) formData.append(key, value);
    });

    await updateData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Profile updated");
      navigate(-1);
    };
  }, [response]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  return (
    <FormWrapper title="Profile Detail" onSubmit={handleSubmit}>
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
        error={errors.password}
        width="col-md-6"
        placeholder="Leave blank to keep existing"
      />
      <SingleImage
        label="Profile Photo"
        name="profilePhoto"
        onChange={handleImageChange}
        value={form.profilePhoto}
        required
        error={errors.profilePhoto}
        width="col-md-12"
      />
    </FormWrapper>
  );
};

export default Profile;
