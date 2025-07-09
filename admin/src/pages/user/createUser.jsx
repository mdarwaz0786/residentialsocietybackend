import { useState } from "react";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import SingleSelect from "../../components/Input/SingleSelect";
import useCreate from "../../hooks/useCreate";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";

const CreateUser = () => {
  const navigation = useNavigate();
  const { validToken } = useAuth();
  const { postData, response, postError } = useCreate("/api/v1/auth/register-user");
  const { data: rolesData } = useFetch("/api/v1/role/get-all-role", validToken);
  const { errors, setErrors, validate } = useFormValidation();
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    memberId: "",
    role: "",
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const handleImageChange = (file) => {
    setForm((f) => ({ ...f, profilePhoto: file }));
    setErrors((errs) => ({ ...errs, profilePhoto: "" }));
  };

  const validationRules = {
    fullName: { required: true, label: "Full Name" },
    mobile: { required: true, label: "Mobile" },
    email: { required: true, label: "Email" },
    password: { required: true, label: "Password" },
    memberId: { required: true, label: "Member ID" },
    role: { required: true, label: "Role" },
    profilePhoto: { required: true, label: "Profile Photo" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) {
      return;
    };

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    await postData(formData, validToken, true);

    if (postError) {
      toast.error(postError);
    };

    if (response?.success) {
      toast.success("User created");
      setForm({
        fullName: "",
        mobile: "",
        email: "",
        password: "",
        memberId: "",
        role: "",
        profilePhoto: null,
      });
      navigation(-1);
    };
  };

  return (
    <FormWrapper title="Create New User" onSubmit={handleSubmit}>
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
        label="Member ID"
        name="memberId"
        value={form.memberId}
        onChange={handleChange}
        required
        error={errors.memberId}
        width="col-md-6"
      />
      <SingleSelect
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        options={rolesData?.data || []}
        optionValue="roleName"
        optionKey="_id"
        required
        error={errors.role}
        width="col-md-6"
      />
      <SingleImage
        label="Profile Photo"
        name="profilePhoto"
        onChange={handleImageChange}
        required
        error={errors.profilePhoto}
        width="col-md-12"
      />
    </FormWrapper>
  );
};

export default CreateUser;
